import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Departments } from 'src/departments/department.entity';
import { DepartmentsRepository } from 'src/departments/departments.repository';
import { Game_user_records } from 'src/game-user-records/game-user-record.entity';
import { GameUserRecordsRepository } from 'src/game-user-records/game-user-records.repository';
import { GameUsersRepository } from 'src/game-users/game-users.repository';
import { Game_Users } from 'src/game-users/games-user.entity';
import { Headquarters } from 'src/headquarters/headquarter.entity';
import { HeadquartersRepository } from 'src/headquarters/headquarters.repository';
import { Institutions } from 'src/institutions/institution.entity';
import { InstiturionsRepository } from 'src/institutions/institutions.repository';
import { Mini_games } from 'src/mini-games/mini-game.entity';
import { MiniGamesRepository } from 'src/mini-games/mini-games.repository';
import { Subject_mini_game } from 'src/subject-mini-game/subject-mini-game.entity';
import { SubjectMiniGameRepository } from 'src/subject-mini-game/subject-mini-game.repository';
import { Subjects } from 'src/subjects/subject.entity';
import { SubjectsRepository } from 'src/subjects/subjects.repository';
import { Towns } from 'src/towns/town.entity';
import { TownsRepository } from 'src/towns/towns.repository';
import { ParserService } from 'src/utils/parser/parser.service';
import { QueriesService } from 'src/utils/queries/queries.service';
import { DashBoardController } from './dashboard.controller';
import { DashBoardService } from './dashboard.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        DepartmentsRepository,
        Departments,
        TownsRepository,
        Towns,
        InstiturionsRepository,
        Institutions,
        HeadquartersRepository,
        Headquarters,
        GameUsersRepository,
        Game_Users,
        GameUserRecordsRepository,
        Game_user_records,
        MiniGamesRepository,
        Mini_games,
        SubjectMiniGameRepository,
        Subject_mini_game,
        SubjectsRepository,
        Subjects,
      ],
      'default',
    ),
  ],
  controllers: [DashBoardController],
  providers: [DashBoardService, ParserService, QueriesService],
})
export class DashboardModule {}
