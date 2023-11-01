import { MigrationInterface, QueryRunner } from "typeorm";

export class TableInit1698866206650 implements MigrationInterface {
    name = 'TableInit1698866206650'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tabs" DROP CONSTRAINT "FK_4499831000a23a5e869e43b4669"`);
        await queryRunner.query(`ALTER TABLE "tabs" ALTER COLUMN "work_session_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tabs" ADD CONSTRAINT "FK_4499831000a23a5e869e43b4669" FOREIGN KEY ("work_session_id") REFERENCES "work_sessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tabs" DROP CONSTRAINT "FK_4499831000a23a5e869e43b4669"`);
        await queryRunner.query(`ALTER TABLE "tabs" ALTER COLUMN "work_session_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tabs" ADD CONSTRAINT "FK_4499831000a23a5e869e43b4669" FOREIGN KEY ("work_session_id") REFERENCES "work_sessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
