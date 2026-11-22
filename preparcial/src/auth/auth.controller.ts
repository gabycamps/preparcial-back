import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Public } from '@nestjs/authentication';
import { AuthService } from './auth.service.js';
import { LoginDto, RegisterDto, RefreshDto } from './auth.dto.js';

@Public()
@Controller('auth')
export class AuthController {
    constructor(private readonly auth: AuthService) {}

    @Post('register') // 201 por defecto
    register(@Body() dto: RegisterDto) {
        return this.auth.register(dto);
    }

    @Post('login')
    @HttpCode(200) // un POST responde 201 por defecto; el enunciado pide 200
    login(@Body() dto: LoginDto) {
        return this.auth.login(dto);
    }

    @Post('refresh')
    @HttpCode(200)
    refresh(@Body() dto: RefreshDto) {
        return this.auth.refresh(dto.refreshToken);
    }

    @Post('logout')
    @HttpCode(204) // sin cuerpo en la respuesta
    async logout(@Body() dto: RefreshDto) {
        await this.auth.logout(dto.refreshToken);
    }
}