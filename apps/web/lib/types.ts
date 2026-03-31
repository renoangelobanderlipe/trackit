export type Loan = {
  id: string;
  title: string;
  provider: string | null;
  total_amount: string;
  num_installments: number;
  payment_frequency: "monthly" | "weekly" | "biweekly" | "twice_a_month";
  due_days: number[] | null;
  start_date: string;
  notes: string | null;
  status: "not_started" | "in_progress" | "done";
  total_paid: string;
  total_remaining: string;
  next_due_date: string | null;
  created_at: string;
};

export type Installment = {
  id: string;
  loan_id: string;
  amount: string;
  label: string;
  due_date: string;
  status: "pending" | "paid" | "overdue" | "partial";
  paid_amount: string;
  paid_date: string | null;
  notes: string | null;
  is_overdue: boolean;
};

export type LoanDetail = Loan & {
  installments: Installment[];
};

export type InstallmentWithLoan = Installment & {
  loan: {
    id: string;
    title: string;
  };
};

export type DashboardData = {
  active_loans_count: number;
  total_owed: string;
  total_paid: string;
  upcoming_payments: InstallmentWithLoan[];
  loans_summary: Loan[];
};

export type CreateLoanPayload = {
  title: string;
  provider?: string;
  total_amount: number;
  num_installments: number;
  payment_frequency: string;
  due_days?: number[];
  start_date: string;
  status?: string;
  notes?: string;
};

export type MarkPaidPayload = {
  paid_amount: number;
  paid_date: string;
  notes?: string;
};
