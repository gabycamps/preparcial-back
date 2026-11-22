import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity.js';
import { RolesController } from './roles.controller.js';
import { RolesPolicy } from './roles.policy.js';
import { RolesService } from './roles.service.js';

@Module({
    imports: [TypeOrmModule.forFeature([Role])],
    controllers: [RolesController],
    providers: [RolesService, RolesPolicy], // la policy es un provider normal
})
export class RolesModule {}