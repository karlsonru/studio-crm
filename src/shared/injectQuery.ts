import { Request, Response, NextFunction } from 'express';

export function injectQuery(fields: Array<string>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const query = {} as { [index: string]: string | number };

    // eslint-disable-next-line no-restricted-syntax
    for (const field of fields) {
      query[field] = req.body[field];
    }

    req.body.query = query;

    next();
  };
}
