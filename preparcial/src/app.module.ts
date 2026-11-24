import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule, type Duration } from '@nestjs/authentication';
import { AuthorizationModule } from '@nestjs/authorization';
import { User } from './entities/user.entity.js';
import { Role } from './entities/role.entity.js';
import { UsersModule } from './users/users.module.js';
import { RolesModule } from './roles/roles.module.js';
import { AuthModule } from './auth/auth.module.js';
import { SpotsModule } from './spots/spots.module.js';
import { ReservationsModule } from './reservations/reservations.module.js';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
            type: 'postgres',
            host: config.getOrThrow<string>('DB_HOST'),
            port: Number(config.getOrThrow('DB_PORT')),
            username: config.getOrThrow<string>('DB_USER'),
            password: config.getOrThrow<string>('DB_PASS'),
            database: config.getOrThrow<string>('DB_NAME'),
            entities: [User, Role],
            synchronize: true,
        }),
        }),
        AuthenticationModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
            accessToken: {
            key: config.getOrThrow<string>('JWT_SECRET'),
            issuer: 'preparcial-api',
            audience: 'preparcial-clients',
            ttl: config.getOrThrow<string>('JWT_EXPIRES_IN') as Duration,
            },
            refreshToken: { ttl: config.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN') as Duration },
            allowInMemoryStorage: true,
        }),
        }),
        AuthorizationModule.forRoot(),
        UsersModule,
        RolesModule,
        AuthModule,
        SpotsModule,
        ReservationsModule,
    ],
})
export class AppModule {}