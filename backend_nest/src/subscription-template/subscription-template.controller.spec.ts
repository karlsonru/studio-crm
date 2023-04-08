import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionTemplateController } from './subscription-template.controller';
import { SubscriptionTemplateService } from './subscription-template.service';

describe('SubscriptionTemplateController', () => {
  let controller: SubscriptionTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionTemplateController],
      providers: [SubscriptionTemplateService],
    }).compile();

    controller = module.get<SubscriptionTemplateController>(
      SubscriptionTemplateController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
