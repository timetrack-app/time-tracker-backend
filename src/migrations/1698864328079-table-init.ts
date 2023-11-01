import { MigrationInterface, QueryRunner } from "typeorm";

export class TableInit1698864328079 implements MigrationInterface {
    name = 'TableInit1698864328079'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_dfccf061a469f3aaa576587c21"`);
        await queryRunner.query(`ALTER TABLE "password_reset" ADD "userId" integer`);
        await queryRunner.query(`CREATE INDEX "IDX_1c88db6e50f0704688d1f1978c" ON "password_reset" ("email") `);
        await queryRunner.query(`ALTER TABLE "password_reset" ADD CONSTRAINT "FK_05baebe80e9f8fab8207eda250c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_reset" DROP CONSTRAINT "FK_05baebe80e9f8fab8207eda250c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1c88db6e50f0704688d1f1978c"`);
        await queryRunner.query(`ALTER TABLE "password_reset" DROP COLUMN "userId"`);
        await queryRunner.query(`CREATE INDEX "IDX_dfccf061a469f3aaa576587c21" ON "password_reset" ("email") `);
    }

}
