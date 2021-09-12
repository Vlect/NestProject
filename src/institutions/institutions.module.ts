import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstiturionsRepository } from './institutions.repository';

@Module({
    imports: [TypeOrmModule.forFeature([InstiturionsRepository])],
})
export class InstitutionsModule {}
