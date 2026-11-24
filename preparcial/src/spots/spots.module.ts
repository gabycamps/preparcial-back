import { Module } from '@nestjs/common';
import { SpotsService } from './spots.service.js';
import { SpotsController } from './spots.controller.js';

@Module({
  controllers: [SpotsController],
  providers: [SpotsService],
})
export class SpotsModule {}
