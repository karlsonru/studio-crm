import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionTemplateService } from './subscription-template.service';

describe('SubscriptionTemplateService', () => {
  let service: SubscriptionTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionTemplateService],
    }).compile();

    service = module.get<SubscriptionTemplateService>(
      SubscriptionTemplateService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
