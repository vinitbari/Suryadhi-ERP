import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Loader2, Plus, RefreshCw } from 'lucide-react';
import api from '@/api/client';
import { showToast } from '@/lib/toast';

interface ExchangeOrder {
  id: string;
  exchangeNumber: string;
  poNumber: string;
  lrNumber: string;
  reportDate: string;
  itemName?: string;
  quantity?: number;
  status: string;
}

export default function ExchangeOrdersPage() {
  const [data, setData] = useState<ExchangeOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState('25');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    poNumber: 'PO-2026-001',
    itemName: 'Student Kit',
    quantity: '1',
    reason: 'Size exchange for uniform / student kit items',
  });

  const fetchExchangeOrders = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/operations/exchanges');
      if (res.data.success && Array.isArray(res.data.data)) {
        setData(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to load exchange orders', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeOrders();
  }, []);

  const handleCreateExchange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post('/operations/exchanges', formData);
      if (res.data.success) {
        showToast('Exchange order submitted successfully', 'success');
        setIsModalOpen(false);
        setFormData({
          poNumber: 'PO-2026-001',
          itemName: 'Student Kit',
          quantity: '1',
          reason: 'Size exchange for uniform / student kit items',
        });
        fetchExchangeOrders();
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to submit exchange order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = data.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      item.exchangeNumber?.toLowerCase().includes(q) ||
      item.poNumber?.toLowerCase().includes(q) ||
      item.lrNumber?.toLowerCase().includes(q) ||
      item.itemName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-[1400px] mx-auto pb-12 pt-2 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-[24px] font-normal text-[#333]">Exchange Orders</h1>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0056b3] hover:bg-[#004494] text-white rounded-[3px] h-8 px-4 text-[13px] font-normal flex gap-1.5 items-center shadow-sm"
        >
          <Pencil className="w-3.5 h-3.5 fill-white" /> Add Exchange Order
        </Button>
      </div>
      
      <div className="bg-white border border-[#ccc] shadow-sm">
        {/* Table Top Toolbar */}
        <div className="p-3 border-b border-[#ccc] bg-[#f9f9f9]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <label className="text-[13px] text-slate-600 flex items-center gap-2">
                Search:
                <Input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search orders..."
                  className="h-[30px] w-[220px] border-[#ccc] rounded-sm text-[13px] px-2 bg-white" 
                />
              </label>
            </div>
            
            <div className="flex items-center gap-2 text-[13px] text-slate-600">
              Show 
              <Select value={pageSize} onValueChange={setPageSize}>
                <SelectTrigger className="h-[30px] w-[70px] border-[#ccc] rounded-sm text-[13px] px-2 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              entries
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse min-w-max">
            <thead>
              <tr className="bg-[#f9f9f9]">
                <th className="py-2.5 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] w-[18%]">
                  Exchange Number
                </th>
                <th className="py-2.5 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] w-[18%]">
                  PO Number
                </th>
                <th className="py-2.5 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] w-[18%]">
                  LR Number
                </th>
                <th className="py-2.5 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] w-[18%]">
                  Report Date
                </th>
                <th className="py-2.5 px-3 border-r border-b border-[#ccc] text-[13px] font-bold text-[#333] w-[15%]">
                  Status
                </th>
                <th className="py-2.5 px-3 border-b border-[#ccc] text-[13px] font-bold text-[#333] w-[13%]">
                  Item Details
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[13px] text-slate-500 border-b border-[#ccc]">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-blue-600 mb-1" />
                    Loading exchange orders...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.slice(0, Number(pageSize)).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 border-b border-[#eee]">
                    <td className="py-2.5 px-3 border-r border-[#ccc] text-[13px] font-mono font-semibold text-blue-700">
                      {order.exchangeNumber}
                    </td>
                    <td className="py-2.5 px-3 border-r border-[#ccc] text-[13px] font-mono text-slate-700">
                      {order.poNumber}
                    </td>
                    <td className="py-2.5 px-3 border-r border-[#ccc] text-[13px] font-mono text-slate-600">
                      {order.lrNumber}
                    </td>
                    <td className="py-2.5 px-3 border-r border-[#ccc] text-[13px] text-slate-700">
                      {order.reportDate}
                    </td>
                    <td className="py-2.5 px-3 border-r border-[#ccc] text-[13px]">
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        {order.status || 'REPORTED'}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 text-[13px] text-slate-700">
                      {order.itemName} ({order.quantity || 1})
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-[13px] text-[#555] border-b border-[#ccc]">
                    No exchange orders found. Click "+ Add Exchange Order" above to initiate a kit exchange.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        <div className="bg-[#f9f9f9] p-3 flex items-center justify-between border-t border-[#ccc]">
          <span className="text-xs text-slate-500">
            Showing {filtered.length > 0 ? 1 : 0} to {Math.min(filtered.length, Number(pageSize))} of {filtered.length} entries
          </span>
          <div className="flex border border-[#ccc] rounded-sm overflow-hidden text-[13px] shadow-sm">
            <button className="px-3 py-1 text-[#555] bg-white hover:bg-slate-100 border-r border-[#ccc]">First</button>
            <button className="px-3 py-1 text-[#555] bg-white hover:bg-slate-100 border-r border-[#ccc]">&larr; Prev</button>
            <button className="px-3 py-1 text-[#555] bg-white hover:bg-slate-100 border-r border-[#ccc]">Next &rarr;</button>
            <button className="px-3 py-1 text-[#337ab7] bg-white hover:bg-slate-100">Last</button>
          </div>
        </div>
      </div>

      {/* Add Exchange Order Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-slate-800">Initiate Exchange Order</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateExchange} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Original Purchase Order (PO)</Label>
              <Input 
                value={formData.poNumber}
                onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                placeholder="e.g. PO-2026-001"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Item Name / Program</Label>
                <Input 
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  placeholder="e.g. Nursery Student Kit"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Quantity</Label>
                <Input 
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Reason for Exchange</Label>
              <Textarea 
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={3}
                placeholder="Specify size mismatch, wrong curriculum level, or defect..."
                required
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Submit Exchange Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
