import { MigrationInterface, QueryRunner } from "typeorm";

export class TableInit1699492505674 implements MigrationInterface {
    name = 'TableInit1699492505674'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tabs" ADD "active_work_session_id" integer`);
        await queryRunner.query(`ALTER TABLE "tabs" ADD CONSTRAINT "UQ_bdaa9ad9fbd010fde2e28fa0a1c" UNIQUE ("active_work_session_id")`);
        await queryRunner.query(`ALTER TABLE "work_sessions" ADD CONSTRAINT "UQ_1e2be189b78ac825f2a463b4fe9" UNIQUE ("active_tab_id")`);
        await queryRunner.query(`ALTER TABLE "work_sessions" ADD CONSTRAINT "FK_1e2be189b78ac825f2a463b4fe9" FOREIGN KEY ("active_tab_id") REFERENCES "tabs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tabs" ADD CONSTRAINT "FK_bdaa9ad9fbd010fde2e28fa0a1c" FOREIGN KEY ("active_work_session_id") REFERENCES "work_sessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tabs" DROP CONSTRAINT "FK_bdaa9ad9fbd010fde2e28fa0a1c"`);
        await queryRunner.query(`ALTER TABLE "work_sessions" DROP CONSTRAINT "FK_1e2be189b78ac825f2a463b4fe9"`);
        await queryRunner.query(`ALTER TABLE "work_sessions" DROP CONSTRAINT "UQ_1e2be189b78ac825f2a463b4fe9"`);
        await queryRunner.query(`ALTER TABLE "tabs" DROP CONSTRAINT "UQ_bdaa9ad9fbd010fde2e28fa0a1c"`);
        await queryRunner.query(`ALTER TABLE "tabs" DROP COLUMN "active_work_session_id"`);
    }

}
