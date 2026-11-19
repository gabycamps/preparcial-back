import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule, type Duration } from '@nestjs/authentication';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { User } from './entities/user.entity.js';
import { Role } from './entities/role.entity.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
    imports: [
    ConfigModule.forRoot({ isGlobal: true }), // lee el .env
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
        synchronize: true, // TEMPORAL: se devuelve a false al final
        }),
    }),
    AuthenticationModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
        accessToken: {
            key: config.getOrThrow<string>('JWT_SECRET'),
            issuer: 'preparcial-api',
            audience: 'preparcial-clients',
            ttl: config.getOrThrow<string>('JWT_EXPIRES_IN') as Duration, // '2m', con unidad
        },
        refreshToken: { ttl: config.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN') as Duration },
        allowInMemoryStorage: true,
        }),
    }),
    UsersModule,
    AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}