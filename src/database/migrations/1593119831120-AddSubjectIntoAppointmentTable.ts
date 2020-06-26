import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddSubjectIntoAppointmentTable1593119831120
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'subject',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('appointments', 'subject');
  }
}
