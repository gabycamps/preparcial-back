import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./user.entity.js";
import { Spot } from "./spots.entity.js";


@Entity("reservations")
export class Reservation {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, (user) => user.id)
    id_user: string;

    @ManyToOne(() => Spot, (spot) => spot.id)
    id_spot: string;

    @Column({ name: "date" })
    date: Date;

    @Column({ name: "vehicle_plate" , unique: true })
    vehicle_plate: string;

    @Column({ name: "vehicle_max_charge" })
    vehicle_max_charge: number;

    @Column({ name: "status" })
    status: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
}