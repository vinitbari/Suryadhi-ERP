/**
 * SEMS — Suryadhi Education Management System
 * Server-Side Brand Constants
 *
 * ⚡ Single source of truth for all brand strings on the backend.
 * Import BRAND_SERVER anywhere you need a brand name, domain, or identifier.
 */

export const BRAND_SERVER = {
  /** System abbreviation */
  systemAbbr: 'SEMS',

  /** Full system name */
  systemName: 'Suryadhi Education Management System',

  /** Parent company legal name */
  companyName: 'Suryadhi Learning Pvt. Ltd.',

  /** Short company reference */
  companyShort: 'Suryadhi',

  /** Server startup log name */
  serverName: 'SEMS Server',

  /** API base identifier (used in logs, descriptions) */
  apiIdentifier: 'sems-server',

  /** Copyright footer for generated documents */
  copyright: '© 2026 Suryadhi Learning Pvt. Ltd.',

  /** White-label powered-by footer */
  poweredBy: 'Powered by SEMS — Suryadhi Learning Pvt. Ltd.',

  /** Demo school details (used in seeding) */
  demoSchool: {
    code: 'SL-DEMO-001',
    name: 'SŪNOIAKIDS™ Demo Pre-School',
    email: 'demo@suryadhi.local',
    transferTargetSchool: 'SUNOIA Mumbai Centre',
  },

  /** Default admin email domain */
  adminEmailDomain: 'sems.suryadhi.in',

  /** Payment URL base for generated payment links */
  paymentUrlBase: 'https://pay.sems.suryadhi.in/pay',

  /** Parent app name */
  parentApp: 'SEMS Parent App',

  /** Portals */
  portals: ['SEMS', 'SŪNOIAKIDS™', 'STEPS'],
} as const;
