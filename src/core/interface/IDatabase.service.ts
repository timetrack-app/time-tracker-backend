import { EntityManager, ObjectType, Repository } from 'typeorm';

export interface IDatabaseService {
  getRepository<Entity>(
    entity: ObjectType<Entity>,
  ): Promise<Repository<Entity>>;
  getManager(): Promise<EntityManager>;
}
