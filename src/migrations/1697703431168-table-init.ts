import { MigrationInterface, QueryRunner } from "typeorm";

export class TableInit1697703431168 implements MigrationInterface {
    name = 'TableInit1697703431168'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "work_sessions" ADD "active_task_id" integer`);
        await queryRunner.query(`ALTER TABLE "work_sessions" ADD CONSTRAINT "UQ_ef694e50f064b4719d8fdcdd251" UNIQUE ("active_task_id")`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "isActive" boolean`);
        await queryRunner.query(`ALTER TABLE "tabs" DROP CONSTRAINT "FK_4499831000a23a5e869e43b4669"`);
        await queryRunner.query(`ALTER TABLE "tabs" ALTER COLUMN "work_session_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "work_sessions" ADD CONSTRAINT "FK_ef694e50f064b4719d8fdcdd251" FOREIGN KEY ("active_task_id") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tabs" ADD CONSTRAINT "FK_4499831000a23a5e869e43b4669" FOREIGN KEY ("work_session_id") REFERENCES "work_sessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tabs" DROP CONSTRAINT "FK_4499831000a23a5e869e43b4669"`);
        await queryRunner.query(`ALTER TABLE "work_sessions" DROP CONSTRAINT "FK_ef694e50f064b4719d8fdcdd251"`);
        await queryRunner.query(`ALTER TABLE "tabs" ALTER COLUMN "work_session_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tabs" ADD CONSTRAINT "FK_4499831000a23a5e869e43b4669" FOREIGN KEY ("work_session_id") REFERENCES "work_sessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "work_sessions" DROP CONSTRAINT "UQ_ef694e50f064b4719d8fdcdd251"`);
        await queryRunner.query(`ALTER TABLE "work_sessions" DROP COLUMN "active_task_id"`);
    }

}
