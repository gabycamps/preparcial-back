import {ConflictException,HttpException,HttpStatus,Injectable,UnauthorizedException,} from '@nestjs/common';
import { PasswordHasher, TokenService } from '@nestjs/authentication';
import { QueryFailedError } from 'typeorm';
import { UsersService } from '../users/users.service.js';
import { LoginDto, RegisterDto } from './auth.dto.js';

@Injectable()
export class AuthService {
    constructor(
        private readonly users: UsersService,
        private readonly hasher: PasswordHasher,
        private readonly tokens: TokenService,
    ) {}

    async register(dto: RegisterDto) {
        const email = dto.email.trim().toLowerCase();

        // OJO: await. Sin él, una Promise siempre es "verdadera" y respondería 409 siempre.
        if (await this.users.existsByEmail(email)) {
        throw new ConflictException('Email ya registrado');
        }

        const password = await this.hasher.hash(dto.password); // scrypt, con sal

        try {
        const user = await this.users.create({ email, password, name: dto.name, phone: dto.phone });
        // Solo devolvemos el id: nunca la entidad, que trae el hash.
        return { message: 'Usuario registrado con éxito', userId: user.id };
        } catch (error) {
        // Dos registros simultáneos pueden pasar el existsBy: la base atrapa el segundo (23505).
        if (
            error instanceof QueryFailedError &&
            (error.driverError as { code?: string }).code === '23505'
        ) {
            throw new ConflictException('Email ya registrado');
        }
        throw error; // un error que no reconoces no se debe tragar
        }
    }

    async login(dto: LoginDto) {
        const email = dto.email.trim().toLowerCase();
        const user = await this.users.findForLogin(email);

        // Si el usuario no existe, verify compara contra un hash falso: tarda lo mismo.
        const valid = await this.hasher.verify(dto.password, user?.password);
        if (!user || !valid) {
        throw new UnauthorizedException('Credenciales incorrectas'); // el mismo mensaje en ambos casos
        }

        // Primero credenciales, después estado: no revelamos que la cuenta existe a quien no tiene la clave.
        if (!user.isActive) {
        throw new HttpException('Usuario desactivado', HttpStatus.LOCKED); // 423
        }

        // Devuelve { accessToken, refreshToken, expiresIn } (expiresIn en segundos)
        return this.tokens.issue(user.id, { method: 'password' });
    }

    refresh(refreshToken: string) {
        return this.tokens.refresh(refreshToken);
    }

    logout(refreshToken: string) {
        return this.tokens.revoke(refreshToken);
    }
}