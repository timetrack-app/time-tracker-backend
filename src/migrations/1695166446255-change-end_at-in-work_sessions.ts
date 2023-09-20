import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeEndAtInWorkSessions1695166446255 implements MigrationInterface {
    name = 'ChangeEndAtInWorkSessions1695166446255'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "work_sessions" ALTER COLUMN "end_at" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "work_sessions" ALTER COLUMN "end_at" SET NOT NULL`);
    }

}
