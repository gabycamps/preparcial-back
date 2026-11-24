import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { Reservation } from '../entities/reservations.entity.js';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Spot } from '../entities/spots.entity.js';

@Injectable()
export class ReservationsService {

  constructor(
    @InjectRepository(Reservation)
    private readonly repo: Repository<Reservation>
  ) {}

  async create(dto: CreateReservationDto) {
    if (await this.repo.existsBy({ vehicle_plate: dto.vehicle_plate })) {
      throw new Error('vehicle_plate ya existe');
    }
    if (await dto.status !== 'pending' && dto.status !== 'completed' && dto.status !== 'cancelled') {
      throw new Error('status no válido');
    }

    if (await dto.vehicle_max_charge !== 'standard' && dto.vehicle_max_charge !== 'fast' && dto.vehicle_max_charge !== 'super_fast') {
      throw new Error('vehicle_max_charge no válido');
    }

    if (await dto.vehicle_max_charge === 'standard' && dto.id_spot !== 'standard') {
      throw new Error('vehicle_max_charge no válido para el spot seleccionado');
    }


    if (new Date(dto.date) < new Date()) {
      throw new Error('date no puede ser menor a la fecha actual');
    }
  }

  findAll() {
    return this.repo.find();
  }

  async updateStatus(id: string, status: string) {
    if (status !== 'pending' && status !== 'completed' && status !== 'cancelled') {
      throw new Error('status no válido');
    }

    const reservation = await this.repo.findOneBy({ id });
    if (!reservation) {
      throw new Error('Reserva no encontrada');
    }
    const actualStatus = reservation.status;

    if(actualStatus !== 'pending' && (status !== 'completed'&& status !== 'cancelled')) {
      throw new Error('No se puede cambiar el estado de una reserva completada o cancelada');
    }
    return this.repo.update(id, { status });

  }

  async delete(id: string) {
    return this.repo.delete(id);
  }
}
