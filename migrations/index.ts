import * as migration_20260608_195300_initial from './20260608_195300_initial';

export const migrations = [
  {
    up: migration_20260608_195300_initial.up,
    down: migration_20260608_195300_initial.down,
    name: '20260608_195300_initial'
  },
];
