import { MigrationInterface, QueryRunner } from "typeorm";

export class TableInit1697418547444 implements MigrationInterface {
    name = 'TableInit1697418547444'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "password_reset" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "token" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_709259e99c780c0fce826c92493" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_dfccf061a469f3aaa576587c21" ON "password_reset" ("email") `);
        await queryRunner.query(`ALTER TABLE "tabs" DROP CONSTRAINT "FK_4499831000a23a5e869e43b4669"`);
        await queryRunner.query(`ALTER TABLE "tabs" ALTER COLUMN "work_session_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tabs" ADD CONSTRAINT "FK_4499831000a23a5e869e43b4669" FOREIGN KEY ("work_session_id") REFERENCES "work_sessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tabs" DROP CONSTRAINT "FK_4499831000a23a5e869e43b4669"`);
        await queryRunner.query(`ALTER TABLE "tabs" ALTER COLUMN "work_session_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tabs" ADD CONSTRAINT "FK_4499831000a23a5e869e43b4669" FOREIGN KEY ("work_session_id") REFERENCES "work_sessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dfccf061a469f3aaa576587c21"`);
        await queryRunner.query(`DROP TABLE "password_reset"`);
    }

}
