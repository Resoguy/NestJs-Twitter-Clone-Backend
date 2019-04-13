import { Test, TestingModule } from '@nestjs/testing';
import { TwitService } from './twit.service';

describe('TwitService', () => {
  let service: TwitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwitService],
    }).compile();

    service = module.get<TwitService>(TwitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
