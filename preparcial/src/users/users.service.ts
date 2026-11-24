import {BadRequestException,Injectable,InternalServerErrorException,NotFoundException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity.js';
import { Role } from '../entities/role.entity.js';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly repo: Repository<User>,
        @InjectRepository(Role)
        private readonly rolesRepo: Repository<Role>,
    ) {}

    findById(id: string) {
        return this.repo.findOne({ where: { id }, relations: { roles: true } });
    }

    existsByEmail(email: string) {
        return this.repo.existsBy({ email });
    }

    // El hash está oculto (select: false). addSelect lo trae solo aquí, para el login.
    findForLogin(email: string) {
        return this.repo
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.email = :email', { email })
        .getOne();
    }

    // "password" ya llega hasheado. Quien llame a esto nunca debe devolver la entidad completa.
    create(data: { email: string; password: string; name: string; phone?: string }) {
        return this.repo.save(this.repo.create(data));
    }

    async getProfile(id: string) {
        const user = await this.findById(id);
        if (!user) throw new NotFoundException('Usuario no encontrado');
        return {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        roles: user.roles.map((role) => role.roleName),
        };
    }

    async findAllWithRoles() {
        try {
        const users = await this.repo.find({
            relations: { roles: true },
            order: { createdAt: 'ASC' },
        });
        return users.map((u) => ({
            id: u.id,
            email: u.email,
            name: u.name,
            roles: u.roles.map((role) => role.roleName),
        }));
        } catch {
        throw new InternalServerErrorException('Error al listar usuarios');
        }
    }

    // Reemplaza los roles del usuario por la lista recibida.
    async assignRoles(id: string, roleNames: string[]) {
        const user = await this.findById(id);
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const names = [...new Set(roleNames)]; // sin repetidos
        const found = await Promise.all(
        names.map((roleName) => this.rolesRepo.findOneBy({ roleName })),
        );
        const roles = found.filter((role): role is Role => role !== null);
        if (roles.length !== names.length) {
        throw new BadRequestException('roles inválidos'); // alguno no existe
        }

        user.roles = roles;
        await this.repo.save(user);
        return { message: 'Roles asignados' };
    }

    async deleteById(id: string) {
        try {
        const result = await this.repo.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Usuario no encontrado');
        }
        return { message: 'Usuario eliminado con éxito' };
        } catch (error) {
        throw error;
        }
    }

}