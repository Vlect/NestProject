import { Module } from '@nestjs/common';
import { DashboardModule } from './dashboard/dashboard.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentsModule } from './departments/departments.module';
import { Departments } from './departments/department.entity';

const defaultOptions: TypeOrmModule = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'System.out23',
};
const connectionTwo = 'talentumehs_valle_magico';

@Module({
  imports: [
    DashboardModule,
    DepartmentsModule,
    TypeOrmModule.forRoot({
      ...defaultOptions,
      database: 'talentumehs_valle_open_location',
      entities: [Departments],
      autoLoadEntities: true,
    }),
    TypeOrmModule.forRoot({
      ...defaultOptions,
      name: connectionTwo,
      database: 'talentumehs_valle_magico',
      entities: [],
      autoLoadEntities: true,
    }),
  ],
})
export class AppModule {}
