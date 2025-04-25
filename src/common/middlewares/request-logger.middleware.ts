import { Request, Response, NextFunction } from 'express';
import { NestMiddleware } from '@nestjs/common';

export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start: number = Date.now();

    res.on('finish', () => {
      if (req.method !== 'GET') {
        const duration = Date.now() - start;
        const { method, originalUrl, ip, user, body } = req;
        const bodyAsJson: string = body ? JSON.stringify(body) : 'empty';
        const userData: string = user
          ? ' login: ' + JSON.stringify(user, ['userId', 'username'])
          : '';

        console.log(
          `[${method}] ${res.statusCode} ${originalUrl} body: ${bodyAsJson} from ${ip}${userData} took: ${duration}ms`,
        );
      }
    });

    next();
  }
}
