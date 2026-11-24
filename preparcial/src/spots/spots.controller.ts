import { Controller,Post, Body } from '@nestjs/common';
import { SpotsService } from './spots.service.js';
import { CreateSpotDto } from './dto/create-spot.dto.js';
import { Can } from '@nestjs/authorization';
import { RolesPolicy } from '../roles/roles.policy.js';

@Controller('spots')
export class SpotsController {
  constructor(private readonly spotsService: SpotsService) {}

  @Post()
  @Can(RolesPolicy, 'create')
  create(@Body() createSpotDto: CreateSpotDto) {
    return this.spotsService.create(createSpotDto);
  }
  
}
