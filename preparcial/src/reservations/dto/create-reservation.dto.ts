import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateReservationDto {

    @IsNotEmpty({ message: 'id_user es requerido' })
    id_user: string;

    @IsNotEmpty({ message: 'id_spot es requerido' })
    id_spot: string;

    @IsDate({ message: 'date debe ser una fecha' })
    @IsNotEmpty({ message: 'date es requerido' })
    date: string;

    @IsString({ message: 'vehicle_plate debe ser un texto' })
    @IsNotEmpty({ message: 'vehicle_plate es requerido' })
    vehicle_plate: string;

    @IsNotEmpty({ message: 'vehicle_max_charge es requerido' })
    @IsString({ message: 'vehicle_max_charge debe ser un texto' })
    vehicle_max_charge: string;

    @IsNotEmpty({ message: 'status es requerido' })
    status: string;

}
