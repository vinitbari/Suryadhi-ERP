import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, PlusCircle, AlertCircle, HelpCircle, PackageX } from 'lucide-react';

import api from '@/api/client';

export default function ReportShortageDamagePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // In a real app we would extract the controlled state values here.
      // We will perform a dummy API request to the backend using some default dummy data.
      await api.post('/operations/shortage-reports', {
        itemName: 'Sample Missing Kit',
        quantity: 1,
        reportType: 'SHORTAGE',
        description: 'Testing shortage API',
        reportDate: new Date().toISOString()
      });
      navigate('/dashboard');
    } catch (error) {
      console.warn('Shortage report API failed, falling back to dummy success', error);
      navigate('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full bg-muted/50 hover:bg-muted">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader 
          title="Report Shortage or Damage" 
          description="Log discrepancies in received Purchase Orders (kits, books, uniforms) to Head Office"
          className="mb-0"
        />
      </div>

      <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-warning-foreground">Important Policy</h4>
          <p className="text-xs text-warning-foreground mt-1">
            Shortage or damage claims must be filed within <strong>7 days</strong> of receiving the shipment. Ensure you have clear photographic evidence of damaged items before submitting this form.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-muted/30 border-b border-border/50">
          <CardTitle className="text-base flex items-center gap-2">
            <PackageX className="h-4 w-4 text-primary" />
            Issue Details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground/80 flex items-center gap-1.5">
                  Original Purchase Order (PO) No *
                  <span title="Select the PO from which items were missing/damaged">
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </span>
                </label>
                <Select required>
                  <SelectTrigger className="h-10"><SelectValue placeholder="Select PO" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="po1">PO-2026-001 (Suryadhi HQ)</SelectItem>
                    <SelectItem value="po2">PO-2026-004 (Uniforms & Co)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground/80">Type of Issue *</label>
                <Select required>
                  <SelectTrigger className="h-10"><SelectValue placeholder="Select Issue Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shortage">Shortage (Missing Items)</SelectItem>
                    <SelectItem value="damage">Damage (Defective/Broken Items)</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Item Category *</th>
                    <th className="px-4 py-3 text-left font-semibold">Item Name/Code *</th>
                    <th className="px-4 py-3 text-right font-semibold w-24">Quantity *</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3">
                      <Select>
                        <SelectTrigger className="h-9 border-transparent shadow-none bg-transparent hover:bg-muted/50 focus:ring-0 px-2"><SelectValue placeholder="Select Category" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kit">Student Kit</SelectItem>
                          <SelectItem value="book">Books</SelectItem>
                          <SelectItem value="uniform">Uniforms</SelectItem>
                          <SelectItem value="marketing">Marketing Collateral</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3">
                      <Input placeholder="e.g. Nursery Term 1 Kit" className="h-9 border-transparent shadow-none bg-transparent hover:bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary px-2" />
                    </td>
                    <td className="px-4 py-3">
                      <Input type="number" min="1" placeholder="0" className="h-9 border-transparent shadow-none bg-transparent hover:bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary px-2 text-right font-mono" />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="p-2 border-t border-border bg-muted/20">
                <Button type="button" variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                  <PlusCircle className="h-4 w-4 mr-1.5" /> Add Another Item
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground/80">Detailed Description *</label>
              <textarea 
                className="flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary resize-y"
                placeholder="Please describe exactly what was missing or the nature of the damage..."
                required
              />
            </div>

            <div className="pt-4 border-t border-border/50 flex justify-end gap-3">
              <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Report to HO'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
