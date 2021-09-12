import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectMiniGameRepository } from './subject-mini-game.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SubjectMiniGameRepository])],
})
export class SubjectMiniGameModule {}
