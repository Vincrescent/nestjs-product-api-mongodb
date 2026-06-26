import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createServer } from 'net';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

function findFreePort(startPort: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();

    server.once('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        server.close();
        resolve(findFreePort(startPort + 1));
      } else {
        reject(error);
      }
    });

    server.once('listening', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : startPort;
      server.close(() => resolve(port));
    });

    server.listen(startPort, '127.0.0.1');
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const basePort = Number(process.env.PORT || 3000);
  const port = await findFreePort(basePort);

  if (!process.env.MONGODB_URI) {
    console.warn('Warning: process.env.MONGODB_URI is not defined.');
  }

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
