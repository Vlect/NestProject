import { Module } from '@nestjs/common';
import { QueriesService } from './queries.service';

@Module({
  providers: [QueriesService],
})
export class QueriesModule {}
