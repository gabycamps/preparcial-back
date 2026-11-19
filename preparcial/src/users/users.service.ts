import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity.js';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly repo: Repository<User>,
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
}