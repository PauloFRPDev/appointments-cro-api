import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';

import Status from '../../models/Status';
import StatusSeed from '../../seeds/status.seed';

export default class SeedStatus1611923959245 implements MigrationInterface {
  public async up(_: QueryRunner): Promise<void> {
    await getRepository(Status).save(StatusSeed);
  }

  public async down(_: QueryRunner): Promise<void> {
    // do nothing
  }
}
