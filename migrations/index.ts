import * as migration_20260608_195300_initial from './20260608_195300_initial';
import * as migration_20260722_144604_add_reports_use_cases from './20260722_144604_add_reports_use_cases';
import * as migration_20260822_120000_add_bookings from './20260822_120000_add_bookings';
import * as migration_20260823_090000_lead_form_fields from './20260823_090000_lead_form_fields';
import * as migration_20260823_110000_add_de_locale from './20260823_110000_add_de_locale';
import * as migration_20260823_184017_add_trust_logos from './20260823_184017_add_trust_logos';
import * as migration_20260824_120000_use_cases_section from './20260824_120000_use_cases_section';
import * as migration_20260824_121000_seed_home_use_cases from './20260824_121000_seed_home_use_cases';

export const migrations = [
  {
    up: migration_20260608_195300_initial.up,
    down: migration_20260608_195300_initial.down,
    name: '20260608_195300_initial',
  },
  {
    up: migration_20260722_144604_add_reports_use_cases.up,
    down: migration_20260722_144604_add_reports_use_cases.down,
    name: '20260722_144604_add_reports_use_cases',
  },
  {
    up: migration_20260822_120000_add_bookings.up,
    down: migration_20260822_120000_add_bookings.down,
    name: '20260822_120000_add_bookings',
  },
  {
    up: migration_20260823_090000_lead_form_fields.up,
    down: migration_20260823_090000_lead_form_fields.down,
    name: '20260823_090000_lead_form_fields',
  },
  {
    up: migration_20260823_110000_add_de_locale.up,
    down: migration_20260823_110000_add_de_locale.down,
    name: '20260823_110000_add_de_locale',
  },
  {
    up: migration_20260823_184017_add_trust_logos.up,
    down: migration_20260823_184017_add_trust_logos.down,
    name: '20260823_184017_add_trust_logos'
  },
  {
    up: migration_20260824_120000_use_cases_section.up,
    down: migration_20260824_120000_use_cases_section.down,
    name: '20260824_120000_use_cases_section',
  },
  {
    up: migration_20260824_121000_seed_home_use_cases.up,
    down: migration_20260824_121000_seed_home_use_cases.down,
    name: '20260824_121000_seed_home_use_cases',
  },
];
