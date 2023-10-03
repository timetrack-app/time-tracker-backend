import { inject, injectable } from 'inversify';
import { DataSource, EntityManager, ObjectType, Repository } from 'typeorm';
import { TYPES } from '../type.core';
import { Logger } from '../../common/services/logger.service';

import { IDatabaseService } from '../interface/IDatabase.service';
import { appDataSource } from '../../datasource.config';

@injectable()
export class DatabaseService implements IDatabaseService {
  private static myDataSource: DataSource;
  private static myEntityManager: EntityManager;

  constructor(@inject(TYPES.Logger) private readonly logger: Logger) {}

  private async getConnection(): Promise<DataSource> {
    if (DatabaseService.myDataSource?.isInitialized) {
      this.logger.info('Connection Already Established!');
      return DatabaseService.myDataSource;
    }

    try {
      DatabaseService.myDataSource = await appDataSource.initialize();
      this.logger.info('Connection Established!');
    } catch (error) {
      this.logger.error(`Connection Failed. Error: ${error}`);
    }

    return DatabaseService.myDataSource;
  }

  private async getEntityManager(): Promise<EntityManager> {
    if (DatabaseService.myEntityManager) return DatabaseService.myEntityManager;

    const connection = await this.getConnection();
    DatabaseService.myEntityManager = connection.createEntityManager();

    return DatabaseService.myEntityManager;
  }

  public async getRepository<Entity>(
    entity: ObjectType<Entity>,
  ): Promise<Repository<Entity>> {
    const connection = await this.getConnection();
    return await connection.getRepository(entity);
  }

  public async getManager(): Promise<EntityManager> {
    return await this.getEntityManager();
  }
}
