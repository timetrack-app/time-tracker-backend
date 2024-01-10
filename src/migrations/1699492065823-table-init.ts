import { MigrationInterface, QueryRunner } from "typeorm";

export class TableInit1699492065823 implements MigrationInterface {
    name = 'TableInit1699492065823'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lists" ADD "workSession_id" integer`);
        await queryRunner.query(`ALTER TABLE "lists" ADD CONSTRAINT "UQ_609d041e3bdf086bd4616b9ab21" UNIQUE ("workSession_id")`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "workSession_id" integer`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "UQ_4c2ad79963e9aabf60de29771f3" UNIQUE ("workSession_id")`);
        await queryRunner.query(`ALTER TABLE "work_sessions" ADD "active_tab_id" integer`);
        await queryRunner.query(`ALTER TABLE "work_sessions" ADD "active_list_id" integer`);
        await queryRunner.query(`ALTER TABLE "work_sessions" ADD CONSTRAINT "UQ_e204420aa6c87dbb1cff64a9fab" UNIQUE ("active_list_id")`);
        await queryRunner.query(`ALTER TABLE "lists" ADD CONSTRAINT "FK_609d041e3bdf086bd4616b9ab21" FOREIGN KEY ("workSession_id") REFERENCES "work_sessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_4c2ad79963e9aabf60de29771f3" FOREIGN KEY ("workSession_id") REFERENCES "work_sessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "work_sessions" ADD CONSTRAINT "FK_e204420aa6c87dbb1cff64a9fab" FOREIGN KEY ("active_list_id") REFERENCES "lists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "work_sessions" DROP CONSTRAINT "FK_e204420aa6c87dbb1cff64a9fab"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_4c2ad79963e9aabf60de29771f3"`);
        await queryRunner.query(`ALTER TABLE "lists" DROP CONSTRAINT "FK_609d041e3bdf086bd4616b9ab21"`);
        await queryRunner.query(`ALTER TABLE "work_sessions" DROP CONSTRAINT "UQ_e204420aa6c87dbb1cff64a9fab"`);
        await queryRunner.query(`ALTER TABLE "work_sessions" DROP COLUMN "active_list_id"`);
        await queryRunner.query(`ALTER TABLE "work_sessions" DROP COLUMN "active_tab_id"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "UQ_4c2ad79963e9aabf60de29771f3"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "workSession_id"`);
        await queryRunner.query(`ALTER TABLE "lists" DROP CONSTRAINT "UQ_609d041e3bdf086bd4616b9ab21"`);
        await queryRunner.query(`ALTER TABLE "lists" DROP COLUMN "workSession_id"`);
    }

}
