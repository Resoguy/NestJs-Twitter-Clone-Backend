import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { TwitEntity } from './twit.entity';
import { TwitDTO } from './dto/twit.dto';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class TwitService {
  constructor(
    @InjectRepository(TwitEntity)
    private twitRepository: Repository<TwitEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async allTwits(): Promise<TwitEntity[]> {
    return await this.twitRepository.find();
  }

  async create(userId, twitData: TwitDTO): Promise<TwitEntity> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['twits'],
    });
    if (!user)
      throw new UnauthorizedException('You must login to post a twit!');

    const newTwit = await this.twitRepository.create(twitData);
    user.twits.push(newTwit);
    await this.userRepository.save(user);
    return await this.twitRepository.save(newTwit);
  }

  async update(userId, twitId, twitData: TwitDTO): Promise<UpdateResult> {
    let twit = await this.twitRepository.findOne({
      where: { id: twitId },
      relations: ['user'],
    });
    if (!twit) throw new NotFoundException('There is no such twit!');
    if (twit.user.id !== userId)
      throw new UnauthorizedException('You can only edit your own tweets!');

    return await this.twitRepository.update(twitId, twitData);
  }

  async delete(userId, twitId): Promise<DeleteResult> {
    let twit = await this.twitRepository.findOne({
      where: { id: twitId },
      relations: ['user'],
    });
    if (!twit) throw new NotFoundException('There is no such twit!');
    if (twit.user.id !== userId)
      throw new UnauthorizedException('You can only delete your own tweets!');

    return await this.twitRepository.delete(twitId);
  }
}
