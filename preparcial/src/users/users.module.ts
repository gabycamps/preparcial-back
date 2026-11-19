import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity.js';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // registra el repositorio de User
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // para que AuthModule pueda usarlo
})
export class UsersModule {}