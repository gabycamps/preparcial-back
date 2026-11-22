import {ConflictException,Injectable,InternalServerErrorException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Role } from '../entities/role.entity.js';
import { CreateRoleDto } from './roles.dto.js';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private readonly repo: Repository<Role>,
    ) {}

    async create(dto: CreateRoleDto) {
        if (await this.repo.existsBy({ roleName: dto.role_name })) {
        throw new ConflictException('role_name ya existe');
        }
        try {
        const role = await this.repo.save(
            this.repo.create({ roleName: dto.role_name, description: dto.description }),
        );
        return { message: 'Rol creado con éxito', roleId: role.id };
        } catch (error) {
        // Dos peticiones simultáneas pueden pasar el existsBy: la base atrapa la segunda.
        if (
            error instanceof QueryFailedError &&
            (error.driverError as { code?: string }).code === '23505'
        ) {
            throw new ConflictException('role_name ya existe');
        }
        throw error;
        }
    }

    async findAll() {
        try {
        const roles = await this.repo.find({ order: { createdAt: 'ASC' } });
        // La respuesta usa role_name (snake_case), como pide el enunciado.
        return roles.map((r) => ({ id: r.id, role_name: r.roleName, description: r.description }));
        } catch {
        throw new InternalServerErrorException('Error al obtener roles');
        }
    }
}