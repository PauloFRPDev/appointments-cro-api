import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  TableColumn,
} from 'typeorm';

export default class AddSectorsColumnIntoAppointmentsTable1596816880864
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'sector_id',
        type: 'integer',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'appointments',
      new TableForeignKey({
        name: 'AppointmentSector',
        columnNames: ['sector_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sectors',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('appointments', 'AppointmentSector');

    await queryRunner.dropColumn('appointments', 'sector_id');
  }
}
