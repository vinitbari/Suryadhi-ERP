/**
 * SEMS — Suryadhi Education Management System
 * Brand Configuration File
 *
 * ⚡ IMPORTANT: This is the SINGLE SOURCE OF TRUTH for all branding.
 * Edit values here and the entire application updates automatically.
 * No other files should hard-code brand names.
 *
 * Logo files are in: client/src/assets/
 * To swap a logo, just update the import path below.
 */

// ─── Logo asset imports ───────────────────────────────────────────────────────
// Suryadhi circular icon mark (dark background) — sidebar collapsed + favicon
import suryadhiIcon from '@/assets/WhatsApp Image 2026-08-05 at 6.14.51 PM.jpeg';
// SURYADHI LEARNING full wordmark (black background) — expanded sidebar
import suryadhiLearningLogo from '@/assets/WhatsApp Image 2026-08-05 at 6.14.52 PM (1).jpeg';
// SUNOIA World Pre-School logo
import sunoiaWorldPreschoolLogo from '@/assets/WhatsApp Image 2026-08-05 at 6.14.52 PM (2).jpeg';
// SURYADHI SCHOOL MANAGEMENT SYSTEM badge (was SUSMS) — SEMS badge
import semsBadge from '@/assets/WhatsApp Image 2026-08-05 at 6.14.52 PM.jpeg';
// SURYADHI tagline wordmark — Meditate · Innovate · Educate
import suryadhiTaglineLogo from '@/assets/WhatsApp Image 2026-08-05 at 6.14.53 PM (1).jpeg';
// SUNOIA Global School logo
import sunoiaGlobalSchoolLogo from '@/assets/WhatsApp Image 2026-08-05 at 6.14.53 PM.jpeg';

// ─── Brand Config ─────────────────────────────────────────────────────────────
export const BRAND = {
  /** Short system name displayed on login, sidebar, header badge */
  systemAbbr: 'SEMS',

  /** Full system name */
  systemName: 'Suryadhi Education Management System',

  /** Login page sub-tagline */
  systemTagline: 'SEMS — Suryadhi Education Management System',

  /** Parent company legal name */
  companyName: 'Suryadhi Learning Pvt. Ltd.',

  /** Short company reference */
  companyShort: 'Suryadhi',

  /** Suryadhi Group umbrella name */
  groupName: 'Suryadhi Group',

  /** System version tag shown in sidebar */
  version: 'SEMS v2.0',

  /** Copyright footer line */
  copyright: '© 2026 Suryadhi Learning Pvt. Ltd.',

  /** White-label powered-by footer */
  poweredBy: 'Powered by SEMS — Suryadhi Learning Pvt. Ltd.',

  /** Tagline shown in marketing / academic year step */
  tagline: 'Meditate · Innovate · Educate',

  // ─── Logos ──────────────────────────────────────────────────────────────────

  /** Circular brand icon — used as favicon replacement & sidebar collapsed state */
  iconSrc: suryadhiIcon,

  /** Full SURYADHI LEARNING wordmark — used in expanded sidebar */
  logoSrc: suryadhiLearningLogo,

  /** SURYADHI tagline wordmark (Meditate·Innovate·Educate) */
  taglineLogoSrc: suryadhiTaglineLogo,

  /** SEMS badge logo (was SUSMS) — used on academic-year step in login */
  semsBadgeSrc: semsBadge,

  // ─── Portals (Login Step 2 + Header Switcher) ───────────────────────────────
  portals: [
    {
      name: 'SEMS',
      fullName: 'Suryadhi Education Management System',
      desc: 'Master ERP — School, Franchise & Operations Management',
      color: 'blue',
      logoSrc: suryadhiLearningLogo,
    },
    {
      name: 'SŪNOIAKIDS™',
      fullName: 'SŪNOIAKIDS™ Pre-School & DayCare',
      desc: 'Pre-School Franchise Network, Center & Fee Management',
      color: 'orange',
      logoSrc: sunoiaWorldPreschoolLogo,
    },
    {
      name: 'STEPS',
      fullName: 'Suryadhi Teacher Excellence & Pedagogy System',
      desc: 'Teacher Training, Pedagogy & Academic Excellence Portal',
      color: 'violet',
      logoSrc: sunoiaGlobalSchoolLogo,
    },
  ],

  // ─── Verticals (for reference in reports, documents) ────────────────────────
  verticals: [
    {
      id: 'SNK',
      name: 'SŪNOIAKIDS™ Pre-School & DayCare',
      short: 'SŪNOIAKIDS™',
      type: 'Franchise Pre-School',
      logoSrc: sunoiaWorldPreschoolLogo,
    },
    {
      id: 'SWP',
      name: 'SUNOIA World Pre-School',
      short: 'SUNOIA World',
      type: 'Premium Pre-School Chain',
      logoSrc: sunoiaWorldPreschoolLogo,
    },
    {
      id: 'SNS',
      name: 'SUNOIA School',
      short: 'SUNOIA School',
      type: 'K-12 School Chain',
      logoSrc: sunoiaGlobalSchoolLogo,
    },
    {
      id: 'SPB',
      name: 'Suryadhi Publication',
      short: 'Suryadhi Pub.',
      type: 'In-house Publishing House',
      logoSrc: suryadhiLearningLogo,
    },
    {
      id: 'SEMS',
      name: 'Suryadhi Education Management System',
      short: 'SEMS',
      type: 'Master ERP Engine',
      logoSrc: semsBadge,
    },
  ],

  // ─── App / Parent App references ────────────────────────────────────────────
  parentApp: 'SEMS Parent App',
  parentAppFull: 'SEMS Parent Mobile Application',

  // ─── HQ reference (used in purchase orders, invoices) ───────────────────────
  hqName: 'Suryadhi Learning Pvt. Ltd. — HQ',
} as const;

export type PortalName = (typeof BRAND.portals)[number]['name'];
export type VerticalId = (typeof BRAND.verticals)[number]['id'];
