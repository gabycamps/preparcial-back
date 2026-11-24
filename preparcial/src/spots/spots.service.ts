import { ConflictException, Injectable } from '@nestjs/common';
import { CreateSpotDto } from './dto/create-spot.dto.js';
import { QueryFailedError } from 'typeorm/browser/error/index.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Spot } from '../entities/spots.entity.js';
import { Repository } from 'typeorm/browser/repository/Repository.js';


@Injectable()
export class SpotsService {
  constructor(
    @InjectRepository(Spot)
    private readonly repo: Repository<Spot>
  ) {}
  async create(dto: CreateSpotDto) {

    if (await dto.chargerType !== 'standard' && dto.chargerType !== 'fast' && dto.chargerType !== 'ultra_fast') {
      throw new Error('chargerType no válido');
    }

    if (await this.repo.existsBy({ code: dto.code })) {
      throw new ConflictException('code ya existe');
    }
    try {
      const spot = await this.repo.save(
        this.repo.create({ code: dto.code,chargerType: dto.chargerType, id_supervisor: dto.id_supervisor }),
      );
      return { message: 'Spot creado con éxito', spotId: spot.id };
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string }).code === '23505'
      ) {
        throw new ConflictException('code ya existe');
      }
      throw error;
    }
  }
}