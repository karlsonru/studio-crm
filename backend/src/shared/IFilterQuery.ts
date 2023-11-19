export interface IFilterQuery<T> {
  $and?: IFilterQuery<T>[];
  $or?: IFilterQuery<T>[];
  $nor?: IFilterQuery<T>[];
  $addToSet?: IFilterQuery<T>[];
  $text?: {
    $search: string;
    $language?: string;
    $caseSensitive?: boolean;
    $diacriticSensitive?: boolean;
  };
  $where?: string | ((this: T) => boolean);
  $comment?: string;
  $regex?: RegExp | string;
  $options?: string;
  $all?: any[];
  $elemMatch?: IFilterQuery<T> | { [k: string]: unknown };
  $size?: number;
  $bitsAllClear?: { [key: string]: number };
  $bitsAllSet?: { [key: string]: number };
  $bitsAnyClear?: { [key: string]: number };
  $bitsAnySet?: { [key: string]: number };
  [key: string]: unknown;
}
