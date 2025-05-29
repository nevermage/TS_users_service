import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NotificationsGateway } from '../gateways/users-notifications.gateway';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  constructor(private readonly notificationGateWay: NotificationsGateway) {}

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      if (res.statusCode >= 300) return; // skip failed requests

      const { method, originalUrl, ip, user, body } = req;
      const statusCode: number = res.statusCode;
      const message: string =
        'Admin request incoming: ' +
        JSON.stringify({ statusCode, method, originalUrl, ip, user, body });
      this.notificationGateWay.sendNotification(message);
    });

    next();
  }
}
