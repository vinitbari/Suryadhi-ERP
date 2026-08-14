// ─── Shared Application Constants ──────────────────────────

export const ENQUIRY_STAGES = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  FOLLOW_UP: 'FOLLOW_UP',
  TRIAL_CLASS: 'TRIAL_CLASS',
  CONVERTED: 'CONVERTED',
  LOST: 'LOST',
} as const;

export const ENQUIRY_STAGE_LABELS: Record<string, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  FOLLOW_UP: 'Follow Up',
  TRIAL_CLASS: 'Trial Class',
  CONVERTED: 'Converted',
  LOST: 'Lost',
};

export const ADMISSION_STATUS = {
  ACTIVE: 'ACTIVE',
  GRADUATED: 'GRADUATED',
  QUIT: 'QUIT',
  TRANSFERRED_OUT: 'TRANSFERRED_OUT',
  TRANSFERRED_IN: 'TRANSFERRED_IN',
} as const;

export const ADMISSION_STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Active',
  GRADUATED: 'Graduated',
  QUIT: 'Quit',
  TRANSFERRED_OUT: 'Transferred Out',
  TRANSFERRED_IN: 'Transferred In',
};

export const PAYMENT_MODES = {
  CASH: 'CASH',
  CHEQUE: 'CHEQUE',
  ONLINE: 'ONLINE',
  PAYTM_POS: 'PAYTM_POS',
  BANK_TRANSFER: 'BANK_TRANSFER',
} as const;

export const PAYMENT_MODE_LABELS: Record<string, string> = {
  CASH: 'Cash',
  CHEQUE: 'Cheque',
  ONLINE: 'Online',
  PAYTM_POS: 'PayTM POS',
  BANK_TRANSFER: 'Bank Transfer',
};

export const GENDER = {
  BOY: 'BOY',
  GIRL: 'GIRL',
} as const;

export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SCHOOL_ADMIN: 'SCHOOL_ADMIN',
  TEACHER: 'TEACHER',
  VIEWER: 'VIEWER',
} as const;
