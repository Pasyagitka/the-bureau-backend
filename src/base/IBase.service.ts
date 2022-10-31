export interface IBaseService<T> {
  getAll(): Promise<T[]>;
  get(id: number): Promise<T>;
  update(id: number, entity: T): Promise<T>;
  create(entity: T): Promise<T>;
  remove(id: number);
}
