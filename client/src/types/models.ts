// ─── Domain Model Types ────────────────────────────────────

// ── Academic Year ──────────────────────────────────────────
export interface AcademicYear {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

// ── Program & Batch ────────────────────────────────────────
export interface Program {
  id: string;
  name: string;
  shortName: string;
  ageFrom?: number;
  ageTo?: number;
  sortOrder?: number;
}

export interface Batch {
  id: string;
  timeSlot: string;
  capacity: number;
  programId: string;
  program?: Program;
}

// ── Student & Parent ───────────────────────────────────────
export interface Student {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  dateOfBirth: string;
  gender: 'BOY' | 'GIRL';
  uin?: string | null;
  nationality?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  state?: string;
  country?: string;
  parentId?: string | null;
  parent?: Parent | null;
}

export interface Parent {
  id: string;
  fatherName?: string | null;
  motherName?: string | null;
  fatherMobile?: string | null;
  motherMobile?: string | null;
  fatherEmail?: string | null;
  motherEmail?: string | null;
  fatherOccupation?: string | null;
  motherOccupation?: string | null;
  fatherOrganisation?: string | null;
  motherOrganisation?: string | null;
}

// ── Enquiry ────────────────────────────────────────────────
export type EnquiryStage = 'NEW' | 'CONTACTED' | 'FOLLOW_UP' | 'TRIAL_CLASS' | 'CONVERTED' | 'LOST';

export interface Enquiry {
  id: string;
  enquirerName: string;
  enquirerMobile: string;
  enquirerEmail?: string | null;
  enquirerAddress?: string;
  stage: EnquiryStage;
  subStage?: string | null;
  enquiryDate?: string;
  nextFollowUp?: string | null;
  lastContacted?: string | null;
  hasSibling: boolean;
  isTrialClass: boolean;
  studentId: string;
  student: Student;
  programId: string;
  program: Program;
  mediaSourceId?: string | null;
  mediaSource?: MediaSource | null;
  academicYearId: string;
  schoolId: string;
  convertedToAdmissionId?: string | null;
  _count?: { followUps: number };
  createdAt: string;
  updatedAt: string;
}

export interface FollowUp {
  id: string;
  notes: string;
  nextDate?: string | null;
  contactedVia: string;
  outcome: string;
  createdAt: string;
}

export interface MediaSource {
  id: string;
  name: string;
  isActive: boolean;
}

// ── Admission ──────────────────────────────────────────────
export type AdmissionStatus = 'ACTIVE' | 'GRADUATED' | 'QUIT' | 'TRANSFERRED_OUT' | 'TRANSFERRED_IN';

export interface Admission {
  id: string;
  admissionDate: string;
  admissionType: 'ONLINE' | 'OFFLINE';
  status: AdmissionStatus;
  isUniformRequired: boolean;
  isDiscountApplicable: boolean;
  isTransportRequired: boolean;
  isPreviousSchooling: boolean;
  isKinAttended: boolean;
  hasSibling: boolean;
  studentId: string;
  student: Student;
  programId: string;
  program: Program;
  batchId?: string | null;
  batch?: Batch | null;
  academicYearId: string;
  academicYear?: AcademicYear;
  schoolId: string;
  discountTypeId?: string | null;
  discountType?: DiscountType | null;
  createdAt: string;
  updatedAt: string;
}

export interface DiscountType {
  id: string;
  name: string;
  percentage?: number | null;
  flatAmount?: number | null;
}

// ── Fee & Financial ────────────────────────────────────────
export interface FeeStructure {
  id: string;
  feeType: string;
  term1Amount: number;
  term2Amount: number;
  totalAmount: number;
  programId: string;
  program?: Program;
  academicYearId: string;
  academicYear?: AcademicYear;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  term1Amount: number;
  term2Amount: number;
  totalAmount: number;
  discountAmount: number;
  netAmount: number;
  admissionId: string;
  createdAt: string;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  receiptDate: string;
  amount: number;
  paymentMode: 'CASH' | 'CHEQUE' | 'ONLINE' | 'PAYTM_POS' | 'BANK_TRANSFER';
  bankName?: string | null;
  chequeNumber?: string | null;
  chequeDate?: string | null;
  transactionId?: string | null;
  isCancelled: boolean;
  cancelledAt?: string | null;
  admissionId: string;
  admission?: Admission;
  invoiceId?: string | null;
  depositId?: string | null;
  createdAt: string;
}

export interface Deposit {
  id: string;
  slipNumber: string;
  depositDate: string;
  bankName?: string | null;
  totalAmount: number;
  status: string;
  schoolId: string;
  receipts?: Receipt[];
  _count?: { receipts: number };
}

// ── Purchase Order ─────────────────────────────────────────
export interface PurchaseOrder {
  id: string;
  poNumber: string;
  poDate: string;
  value: number;
  quantity: number;
  status: string;
  remarks?: string;
  asOn: string;
}

// ── Shortage/Damage ────────────────────────────────────────
export interface ShortageDamage {
  id: string;
  number: string;
  reportDate: string;
  quantity: number;
  status: string;
  remarks?: string;
  asOn: string;
}

// ── SOA ────────────────────────────────────────────────────
export interface SOAEntry {
  id: string;
  entryType: string;
  entryDate: string;
  invoiceAmount: number;
  receiptAmount: number;
  description?: string;
}

// ── Dashboard ──────────────────────────────────────────────
export interface DashboardKPIs {
  enquiries: number;
  lsqEnquiries: number;
  grossAdmission: number;
  transferIn: number;
  transferOut: number;
  quit: number;
  netEnrollment: number;
}

export interface DashboardFinancials {
  receivable: number;
  collection: number;
  paymentDue: number;
  fcrDeposited: number;
  fcrPending: number;
  creditNote: number;
}

export interface FeeRateCard {
  program: string;
  status: string;
  fees: { feeType: string; term1: number; term2: number; total: number }[];
}

// ── Navigation ─────────────────────────────────────────────
export interface NavItem {
  label: string;
  href?: string;
  icon?: string;
  badge?: string;
  children?: NavItem[];
}
