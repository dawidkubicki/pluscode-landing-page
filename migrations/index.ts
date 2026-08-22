import * as migration_20260608_195300_initial from './20260608_195300_initial';
import * as migration_20260722_144604_add_reports_use_cases from './20260722_144604_add_reports_use_cases';
import * as migration_20260822_120000_add_bookings from './20260822_120000_add_bookings';

export const migrations = [
  {
    up: migration_20260608_195300_initial.up,
    down: migration_20260608_195300_initial.down,
    name: '20260608_195300_initial',
  },
  {
    up: migration_20260722_144604_add_reports_use_cases.up,
    down: migration_20260722_144604_add_reports_use_cases.down,
    name: '20260722_144604_add_reports_use_cases'
  },
  {
    up: migration_20260822_120000_add_bookings.up,
    down: migration_20260822_120000_add_bookings.down,
    name: '20260822_120000_add_bookings'
  },
];
