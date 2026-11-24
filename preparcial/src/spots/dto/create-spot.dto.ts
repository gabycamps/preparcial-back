import { IsString, IsNotEmpty } from "class-validator";

export class CreateSpotDto {

    @IsNotEmpty({ message: 'code es requerido' })
    @IsString({ message: 'code debe ser un texto' })
    code: string;

    @IsNotEmpty({ message: 'charger_type es requerido' })
    @IsString({ message: 'charger_type debe ser un texto' })
    chargerType: string;

    @IsNotEmpty({ message: 'id_supervisor es requerido' })
    @IsString({ message: 'id_supervisor debe ser un texto' })
    id_supervisor: string;

}


