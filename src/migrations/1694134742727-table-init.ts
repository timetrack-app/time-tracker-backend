import { MigrationInterface, QueryRunner } from "typeorm";

export class TableInit1694134742727 implements MigrationInterface {
    name = 'TableInit1694134742727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tasks" ("id" SERIAL NOT NULL, "list_id" integer NOT NULL, "displayOrder" integer NOT NULL, "name" character varying NOT NULL, "description" character varying, "total_time" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lists" ("id" SERIAL NOT NULL, "tab_id" integer NOT NULL, "name" character varying NOT NULL, "display_order" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_268b525e9a6dd04d0685cb2aaaa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tabs" ("id" SERIAL NOT NULL, "work_session_id" integer NOT NULL, "name" character varying NOT NULL, "display_order" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3941e8f644528bfc73a3a16afe4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "work_sessions" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "start_at" TIMESTAMP NOT NULL, "end_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2b15ef494243f1cc2bf0f731e76" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_email_verifications" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "verificationToken" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "UQ_82dc234737987db63a74dfffa6f" UNIQUE ("email"), CONSTRAINT "REL_9fa2f3f9942a2f7550fef0f423" UNIQUE ("userId"), CONSTRAINT "PK_6f8c4d3c47a5bdff33f6009477d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "emailVerificationId" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "REL_255fab8c8914dadb206b185dbb" UNIQUE ("emailVerificationId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "template_lists" ("id" SERIAL NOT NULL, "template_tab_id" integer NOT NULL, "name" character varying NOT NULL, "display_order" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_baa2861fce222f481449d678ad5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "template_tabs" ("id" SERIAL NOT NULL, "template_id" integer NOT NULL, "name" character varying NOT NULL, "display_order" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6fd35716e3148c8952835f0d322" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "templates" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_515948649ce0bbbe391de702ae5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_f69dc09246817393a46eb2a47c5" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lists" ADD CONSTRAINT "FK_8763f67ca62a3d68345d6b41ec7" FOREIGN KEY ("tab_id") REFERENCES "tabs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tabs" ADD CONSTRAINT "FK_4499831000a23a5e869e43b4669" FOREIGN KEY ("work_session_id") REFERENCES "work_sessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "work_sessions" ADD CONSTRAINT "FK_4dfb452d1af3bae425933010980" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_email_verifications" ADD CONSTRAINT "FK_9fa2f3f9942a2f7550fef0f4232" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_255fab8c8914dadb206b185dbb1" FOREIGN KEY ("emailVerificationId") REFERENCES "user_email_verifications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "template_lists" ADD CONSTRAINT "FK_def6c0d49357e3496515a654365" FOREIGN KEY ("template_tab_id") REFERENCES "template_tabs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "template_tabs" ADD CONSTRAINT "FK_dc667f4691cd4d761b962f4df83" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "templates" ADD CONSTRAINT "FK_58b6865e85d7d38ae6478f002f1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "templates" DROP CONSTRAINT "FK_58b6865e85d7d38ae6478f002f1"`);
        await queryRunner.query(`ALTER TABLE "template_tabs" DROP CONSTRAINT "FK_dc667f4691cd4d761b962f4df83"`);
        await queryRunner.query(`ALTER TABLE "template_lists" DROP CONSTRAINT "FK_def6c0d49357e3496515a654365"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_255fab8c8914dadb206b185dbb1"`);
        await queryRunner.query(`ALTER TABLE "user_email_verifications" DROP CONSTRAINT "FK_9fa2f3f9942a2f7550fef0f4232"`);
        await queryRunner.query(`ALTER TABLE "work_sessions" DROP CONSTRAINT "FK_4dfb452d1af3bae425933010980"`);
        await queryRunner.query(`ALTER TABLE "tabs" DROP CONSTRAINT "FK_4499831000a23a5e869e43b4669"`);
        await queryRunner.query(`ALTER TABLE "lists" DROP CONSTRAINT "FK_8763f67ca62a3d68345d6b41ec7"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_f69dc09246817393a46eb2a47c5"`);
        await queryRunner.query(`DROP TABLE "templates"`);
        await queryRunner.query(`DROP TABLE "template_tabs"`);
        await queryRunner.query(`DROP TABLE "template_lists"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "user_email_verifications"`);
        await queryRunner.query(`DROP TABLE "work_sessions"`);
        await queryRunner.query(`DROP TABLE "tabs"`);
        await queryRunner.query(`DROP TABLE "lists"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
    }

}
