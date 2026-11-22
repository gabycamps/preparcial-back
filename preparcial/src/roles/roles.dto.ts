import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
    @IsString({ message: 'role_name debe ser un texto' })
    @IsNotEmpty({ message: 'role_name es requerido' })
    role_name: string;

    @IsOptional()
    @IsString()
    description?: string;
}