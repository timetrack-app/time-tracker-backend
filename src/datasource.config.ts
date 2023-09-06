import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const appDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: ['src/modules/**/entity/*.entity{.ts,.js}'],
  migrations: ['src/migrations/**/*{.ts,.js}'],
  migrationsTableName: 'timeTracker_app_migrations',
  logging: ['query', 'error', 'schema'],
});
