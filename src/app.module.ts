import { Module } from '@nestjs/common';
import { DashboardModule } from './dashboard/dashboard.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentsModule } from './departments/departments.module';
import { Departments } from './departments/department.entity';
import { TownsModule } from './towns/towns.module';
import { HeadquartersModule } from './headquarters/headquarters.module';
import { InstitutionsModule } from './institutions/institutions.module';
import { Towns } from './towns/town.entity';
import { Institutions } from './institutions/institution.entity';
import { GameUsersModule } from './game-users/game-users.module';
import { GameUserRecordsModule } from './game-user-records/game-user-records.module';
import { MiniGamesModule } from './mini-games/mini-games.module';
import { SubjectMiniGameModule } from './subject-mini-game/subject-mini-game.module';
import { SubjectsModule } from './subjects/subjects.module';
import { GradesModule } from './grades/grades.module';
import { Game_Users } from './game-users/games-user.entity';
import { Game_user_records } from './game-user-records/game-user-record.entity';
import { Mini_games } from './mini-games/mini-game.entity';
import { Subject_mini_game } from './subject-mini-game/subject-mini-game.entity';
import { Subjects } from './subjects/subject.entity';

const defaultOptions: TypeOrmModule = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
};
const connectionTwo = 'talentumehs_valle_magico';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...defaultOptions,
      database: 'talentumehs_valle_open_location',
      entities: [Departments, Towns, Institutions],
      autoLoadEntities: true,
    }),
    TypeOrmModule.forRoot({
      ...defaultOptions,
      name: connectionTwo,
      database: 'talentumehs_valle_magico',
      entities: [
        Game_Users,
        Game_user_records,
        Mini_games,
        Subject_mini_game,
        Subjects,
      ],
      autoLoadEntities: true,
    }),
    DashboardModule,
    DepartmentsModule,
    TownsModule,
    HeadquartersModule,
    InstitutionsModule,
    GameUsersModule,
    GameUserRecordsModule,
    MiniGamesModule,
    SubjectMiniGameModule,
    SubjectsModule,
    GradesModule,
  ],
})
export class AppModule {}
