import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity.js";
import { Reservation } from "./reservations.entity.js";


@Entity("spots")
export class Spot {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: "code", unique: true })
    code: string;

    @Column({ name: "charger_type" })
    chargerType: string;

    @ManyToOne(() => Role, (role) => role.id)
    id_supervisor: string;

    @OneToMany(() => Reservation, (reservation) => reservation.id_spot)
    reservations: Reservation[];

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

}