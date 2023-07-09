import { KnowledgeSource } from '../models/IStudentModel';

export function getKnowledgeSourceName(knowledgeSource?: KnowledgeSource) {
  switch (knowledgeSource) {
    case KnowledgeSource.VK:
      return 'Вконтакте';
    case KnowledgeSource.SITE:
      return 'Сайт';
    case KnowledgeSource.FRIENDS:
      return 'Друзья, знакомые';
    case KnowledgeSource.ADVERT_PAPER:
      return 'Рекламные буклеты';
    case KnowledgeSource.ADVERT_CLINIC:
      return 'Реклама в поликлинике';
    case KnowledgeSource.OTHER:
      return 'Другой';
    case KnowledgeSource.UNKNOWN:
    default:
      return 'Не указан';
  }
}
