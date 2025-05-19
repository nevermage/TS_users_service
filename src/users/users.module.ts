import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AdminMiddleware } from '../common/middlewares';
import { NotificationsGateway } from '../common/gateways/users-notifications.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, NotificationsGateway],
  controllers: [UsersController],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminMiddleware)
      .forRoutes(
        { path: 'users/*path', method: RequestMethod.POST },
        { path: 'users/*path', method: RequestMethod.PUT },
        { path: 'users/*path', method: RequestMethod.DELETE },
      );
  }
}
