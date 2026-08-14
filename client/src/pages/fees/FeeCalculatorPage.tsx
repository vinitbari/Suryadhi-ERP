import { useState, useEffect } from 'react';

import { Calculator, Loader2 } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import api from '@/api/client';
import { showToast } from '@/lib/toast';

// ─── Dummy Types & Data ────────────────────────────────────
interface FeeBreakup {
  feeType: string;
  term1Amount: number;
  term2Amount: number;
  totalAmount: number;
}

interface CalculationResult {
  feeBreakup: FeeBreakup[];
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  term1Total: number;
  term2Total: number;
}

const feeTypeLabels: Record<string, string> = {
  REGISTRATION: 'Registration Fee',
  TERM_FEE: 'Term Fee',
  TUITION_FEE: 'Tuition Fee',
  ACTIVITY_FEE: 'Activity Fee',
  MATERIAL_FEE: 'Material Fee',
  UNIFORM_FEE: 'Uniform Fee',
  TRANSPORT_FEE: 'Transport Fee',
  OTHER: 'Other Fee',
};

export default function FeeCalculatorPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [discountTypes, setDiscountTypes] = useState<any[]>([]);
  const [programId, setProgramId] = useState('');
  const [admissionDate, setAdmissionDate] = useState('');
  const [discountTypeId, setDiscountTypeId] = useState('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load dropdown options from backend
    const fetchLookups = async () => {
      try {
        const [progRes, discRes] = await Promise.all([
          api.get('/lookups/programs'),
          api.get('/lookups/discount-types')
        ]);
        if (progRes.data.success) {
          setPrograms(progRes.data.data);
        }
        if (discRes.data.success) {
          setDiscountTypes(discRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load lookups', err);
      }
    };
    fetchLookups();
  }, []);

  const calculate = async () => {
    if (!programId || !admissionDate) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await api.get('/fees/calculate', {
        params: {
          programId,
          admissionDate,
          ...(discountTypeId && { discountTypeId })
        }
      });
      if (res.data.success) {
        setResult(res.data.data);
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to calculate fee', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Fee Calculator"
        description="Instantly calculate term-wise fee breakup and generate quotations"
      />

      <Card className="shadow-md">
        <CardHeader className="bg-muted/30 border-b border-border/50">
          <CardTitle className="text-base flex items-center gap-2">
            <Calculator className="h-4 w-4 text-primary" />
            Calculation Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Program Name *</label>
              <select
                value={programId}
                onChange={(e) => setProgramId(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
              >
                <option value="">Select Program</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Admission Date *</label>
              <Input
                type="date"
                value={admissionDate}
                onChange={(e) => setAdmissionDate(e.target.value)}
                className="h-10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Discount Type</label>
              <select
                value={discountTypeId}
                onChange={(e) => setDiscountTypeId(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
              >
                <option value="">No Discount</option>
                {discountTypes.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} {d.percentage ? `(${d.percentage}%)` : `(Flat ₹${d.flatAmount})`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end mt-6 pt-4 border-t border-border/50">
            <Button
              onClick={calculate}
              disabled={loading || !programId || !admissionDate}
              className="min-w-[140px]"
              size="lg"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Calculator className="h-4 w-4 mr-2" />
              )}
              Calculate
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-primary/20 shadow-lg shadow-primary/5">
          <CardHeader className="bg-primary/5 border-b border-primary/10 flex flex-row items-center justify-between py-4">
            <CardTitle className="text-lg">Fee Break Up Result</CardTitle>
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Total Amount Payable</p>
              <p className="text-2xl font-bold text-primary leading-none">{formatCurrency(result.totalAmount)}</p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/10">
                  <TableHead className="w-[30%]">Fee Component</TableHead>
                  <TableHead className="text-right">Term 1 Invoice Amount</TableHead>
                  <TableHead className="text-right">Term 2 Invoice Amount</TableHead>
                  <TableHead className="text-right">Total Invoice Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.feeBreakup.map((fee, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{feeTypeLabels[fee.feeType] || fee.feeType}</TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(fee.term1Amount)}</TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(fee.term2Amount)}</TableCell>
                    <TableCell className="text-right font-mono font-semibold">{formatCurrency(fee.totalAmount)}</TableCell>
                  </TableRow>
                ))}

                {/* Discount Row */}
                {result.discountAmount > 0 && (
                  <TableRow className="bg-emerald-500/5">
                    <TableCell className="font-medium text-emerald-600">Applied Discount</TableCell>
                    <TableCell className="text-right font-mono text-emerald-600/70">- {formatCurrency(result.discountAmount / 2)}</TableCell>
                    <TableCell className="text-right font-mono text-emerald-600/70">- {formatCurrency(result.discountAmount / 2)}</TableCell>
                    <TableCell className="text-right font-mono font-semibold text-emerald-600">- {formatCurrency(result.discountAmount)}</TableCell>
                  </TableRow>
                )}

                {/* Final Totals Row */}
                <TableRow className="bg-muted/30">
                  <TableCell className="font-bold text-base">Net Total</TableCell>
                  <TableCell className="text-right font-mono font-bold text-base text-foreground/80">{formatCurrency(result.term1Total)}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-base text-foreground/80">{formatCurrency(result.term2Total)}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-lg text-primary">{formatCurrency(result.totalAmount)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
