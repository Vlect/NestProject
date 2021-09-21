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
import { QueriesModule } from './utils/queries/queries.module';
import { ParserModule } from './utils/parser/parser.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_ONE_NAME,
      entities: [Departments, Towns, Institutions],
      autoLoadEntities: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      name: process.env.DB_TWO_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_TWO_NAME,
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
    QueriesModule,
    ParserModule,
  ],
})
export class AppModule {}
