import * as migration_20260123_132509_committee_migration from './20260123_132509_committee_migration';

export const migrations = [
  {
    up: migration_20260123_132509_committee_migration.up,
    down: migration_20260123_132509_committee_migration.down,
    name: '20260123_132509_committee_migration'
  },
];
