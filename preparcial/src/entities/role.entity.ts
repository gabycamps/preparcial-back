import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../entities/user.entity.js';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'role_name', unique: true })
    roleName: string;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToMany(() => User, (user) => user.roles)
    users: User[];
}