import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity.js';
import { Role } from '../entities/role.entity.js';
import { UsersController } from './users.controller.js';
import { UsersPolicy } from './users.policy.js';
import { UsersService } from './users.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [UsersController],
  providers: [UsersService, UsersPolicy],
  exports: [UsersService], // AuthModule lo usa
})
export class UsersModule {}