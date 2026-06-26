import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as dns from 'dns';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';

// Set explicit DNS servers before MongoDB SRV resolution.
dns.setServers(['8.8.8.8', '1.1.1.1']);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      expandVariables: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri =
          configService.get<string>('MONGODB_URI') ||
          configService.get<string>('MONGO_URI') ||
          process.env.MONGODB_URI ||
          process.env.MONGO_URI;

        if (!uri) {
          throw new Error(
            'MongoDB connection string is not defined. Set MONGODB_URI in .env.',
          );
        }

        return {
          uri,
          retryAttempts: 5,
          retryDelay: 3000,
          serverSelectionTimeoutMS: 10000,
          autoCreate: true,
          connectionFactory: (connection) => {
            connection.on('error', (error) => {
              console.error('Mongoose connection error:', error);
            });
            return connection;
          },
        };
      },
    }),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
