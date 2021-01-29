import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';

import Sector from '../../models/Sector';
import SeedSector from '../../seeds/sector.seed';

export default class SeedSector1611925923465 implements MigrationInterface {
  public async up(_: QueryRunner): Promise<void> {
    await getRepository(Sector).save(SeedSector);
  }

  public async down(_: QueryRunner): Promise<void> {
    // do nothing
  }
}
