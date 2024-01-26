import { MigrationInterface, QueryRunner } from "typeorm";

export class TableInit1706252273011 implements MigrationInterface {
    name = 'TableInit1706252273011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "work_sessions" ADD "isPaused" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "work_sessions" DROP COLUMN "isPaused"`);
    }

}
