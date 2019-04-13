import { Module } from '@nestjs/common';
import { TwitController } from './twit.controller';
import { TwitService } from './twit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwitEntity } from './twit.entity';
import { UserEntity } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TwitEntity, UserEntity])],
  controllers: [TwitController],
  providers: [TwitService],
})
export class TwitModule {}
