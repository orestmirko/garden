import { CryptoHelper } from '#common/helpers';
import { AdminConfigurationServiceStatic } from '#config/admin/configuration.service-static';
import { UserRoleEnum, UserStatusEnum } from '#modules/user/models/enums';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSuperAdmin1711721934238 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const email = AdminConfigurationServiceStatic.email;
    const password = CryptoHelper.hashPassword(AdminConfigurationServiceStatic.password);
    const firstName = 'Super';
    const lastName = 'Admin';
    const role = UserRoleEnum.SUPER_ADMIN;
    const status = UserStatusEnum.Active;

    await queryRunner.query(`INSERT INTO "users" (
      "created", "updated", "id", "firstName", "lastName", "email", "status", "password", "role"
      ) VALUES (
      now(), now(), uuid_generate_v4(), '${firstName}', '${lastName}', '${email}', '${status}', '${password}', '${role}')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "users" WHERE "email" = 'superAdmin@track.com'`);
  }
}
