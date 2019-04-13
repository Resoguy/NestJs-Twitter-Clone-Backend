import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async showUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find({ relations: ['twits'] });
  }

  async login(loginData: UserDTO): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { email: loginData.email },
    });
    if (!user || !(await user.comparePassword(loginData.password))) {
      throw new UnauthorizedException('Invalid email/password!');
    }

    return await user.toResponse();
  }

  async register(registerData: UserDTO): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { email: registerData.email },
    });
    if (user)
      throw new BadRequestException('User with this email already exists!');

    let newUser = await this.userRepository.create(registerData);
    newUser = await this.userRepository.save(newUser);
    return newUser.toResponse();
  }
}
