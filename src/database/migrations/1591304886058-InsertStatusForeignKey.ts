import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export default class InsertStatusForeignKey1591304886058
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'appointments',
      new TableForeignKey({
        name: 'AppointmentStatus',
        columnNames: ['status_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'status',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('appointments', 'AppointmentStatus');
  }
}
