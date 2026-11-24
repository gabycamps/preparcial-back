import { Body, Controller, Get, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';
import { UsersPolicy } from './users.policy.js';
import { UsersService } from './users.service.js';
import { AssignRolesDto } from './users.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  // Cualquier usuario autenticado. Sin token, la autenticación ya responde 401.
  @Get('me')
  @Can.Anyone()
  me(@CurrentUser('id') id: string) {
    return this.users.getProfile(id);
  }

  @Get()
  @Can(UsersPolicy, 'list')
  findAll() {
    return this.users.findAllWithRoles();
  }

  // ver un usuario por id. Solo supervisor (y admin por before()).
  // Debe ir DESPUES de 'me': si no, /users/me caeria aqui y 'me' no es un uuid.
  @Get(':id')
  @Can(UsersPolicy, 'findOne')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.users.getProfile(id);
  }

  @Patch(':id/roles') // 200 por defecto
  @Can(UsersPolicy, 'assignRoles')
  assignRoles(@Param('id', ParseUUIDPipe) id: string, @Body() dto: AssignRolesDto) {
    return this.users.assignRoles(id, dto.roles);
  }
}