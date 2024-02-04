import { MigrationInterface, QueryRunner } from "typeorm";

export class TableInit1707009979779 implements MigrationInterface {
    name = 'TableInit1707009979779'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_f69dc09246817393a46eb2a47c5"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_4c2ad79963e9aabf60de29771f3"`);
        await queryRunner.query(`ALTER TABLE "lists" DROP CONSTRAINT "FK_8763f67ca62a3d68345d6b41ec7"`);
        await queryRunner.query(`ALTER TABLE "tabs" DROP CONSTRAINT "FK_4499831000a23a5e869e43b4669"`);
        await queryRunner.query(`ALTER TABLE "tabs" DROP CONSTRAINT "FK_bdaa9ad9fbd010fde2e28fa0a1c"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_f69dc09246817393a46eb2a47c5" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_4c2ad79963e9aabf60de29771f3" FOREIGN KEY ("workSession_id") REFERENCES "work_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "lists" ADD CONSTRAINT "FK_8763f67ca62a3d68345d6b41ec7" FOREIGN KEY ("tab_id") REFERENCES "tabs"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tabs" ADD CONSTRAINT "FK_4499831000a23a5e869e43b4669" FOREIGN KEY ("work_session_id") REFERENCES "work_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tabs" ADD CONSTRAINT "FK_bdaa9ad9fbd010fde2e28fa0a1c" FOREIGN KEY ("active_work_session_id") REFERENCES "work_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tabs" DROP CONSTRAINT "FK_bdaa9ad9fbd010fde2e28fa0a1c"`);
        await queryRunner.query(`ALTER TABLE "tabs" DROP CONSTRAINT "FK_4499831000a23a5e869e43b4669"`);
        await queryRunner.query(`ALTER TABLE "lists" DROP CONSTRAINT "FK_8763f67ca62a3d68345d6b41ec7"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_4c2ad79963e9aabf60de29771f3"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_f69dc09246817393a46eb2a47c5"`);
        await queryRunner.query(`ALTER TABLE "tabs" ADD CONSTRAINT "FK_bdaa9ad9fbd010fde2e28fa0a1c" FOREIGN KEY ("active_work_session_id") REFERENCES "work_sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tabs" ADD CONSTRAINT "FK_4499831000a23a5e869e43b4669" FOREIGN KEY ("work_session_id") REFERENCES "work_sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lists" ADD CONSTRAINT "FK_8763f67ca62a3d68345d6b41ec7" FOREIGN KEY ("tab_id") REFERENCES "tabs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_4c2ad79963e9aabf60de29771f3" FOREIGN KEY ("workSession_id") REFERENCES "work_sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_f69dc09246817393a46eb2a47c5" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
