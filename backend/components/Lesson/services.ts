import { BasicServices, IBasicQuery } from '../../shared/component';

// eslint-disable-next-line max-len
// идея проверки - проверяем в базе уроков все уроки преподователя teacher с день day и с dateTo меньше чем создаваемый dateFrom
// eslint-disable-next-line max-len
// найденные уроки итерируем и проверяем timeStart / timeEnd - если timeStart / timeEnd создаваемого уроки попадает в один из интервалов уже имеющихся уроков
// тогда значит урок пересекается с каким-то другим, нужно запретить создание такого урока

export class LessonServices extends BasicServices {
  findByDay = async (bodyQuery: IBasicQuery, limit: number) => {
    const query = {
      dateFrom: { $lte: bodyQuery.date },
      dateTo: { $gte: bodyQuery.date },
      isActive: bodyQuery.isActive,
      day: bodyQuery.day,
    };

    const result = await this.db.find(query).populate('teacher').limit(limit).sort({ timeStart: 1 });

    return result;
  };
}
