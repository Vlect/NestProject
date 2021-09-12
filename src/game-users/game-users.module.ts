import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Headquarters } from 'src/headquarters/headquarter.entity';
import { HeadquartersRepository } from 'src/headquarters/headquarters.repository';
import { GameUsersRepository } from './game-users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GameUsersRepository, HeadquartersRepository, Headquarters])],
})
export class GameUsersModule {}
