import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
    @IsEmail({}, { message: 'Email inválido' })
    email: string;

    @IsString()
    @MinLength(12)
    @MaxLength(128)
    password: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    phone?: string;
}

export class LoginDto {
    @IsEmail({}, { message: 'Email inválido' })
    email: string;

    @IsString()
    password: string;
    
}

export class RefreshDto {
    @IsString({ message: 'refreshToken debe ser un texto' })
    @IsNotEmpty({ message: 'refreshToken es requerido' })
    refreshToken: string;
    }