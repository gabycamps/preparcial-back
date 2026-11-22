import { Body, Controller, Get, Post } from '@nestjs/common';
import { Can } from '@nestjs/authorization';
import { RolesPolicy } from './roles.policy.js';
import { RolesService } from './roles.service.js';
import { CreateRoleDto } from './roles.dto.js';

@Controller('roles')
export class RolesController {
    constructor(private readonly roles: RolesService) {}

    @Post() // 201 por defecto
    @Can(RolesPolicy, 'create')
    create(@Body() dto: CreateRoleDto) {
        return this.roles.create(dto);
    }

    @Get()
    @Can(RolesPolicy, 'list')
    findAll() {
        return this.roles.findAll();
    }
}