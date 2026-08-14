import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import api from '@/api/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { showToast } from '@/lib/toast';

export default function EnquiryFollowUpPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'history' | 'new'>('history');
  
  const [enquiry, setEnquiry] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form states for new follow up
  const [stage, setStage] = useState('Interested');
  const [subStage, setSubStage] = useState('Admission Enquiry (New Opportunity)');
  const [stageReason, setStageReason] = useState('Walk-in Visit');
  const [followUpDate, setFollowUpDate] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (id) {
      api.get(`/enquiries/${id}`)
        .then((res) => {
          if (res.data.success) {
            setEnquiry(res.data.data);
          }
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setIsSaving(true);
    try {
      await api.post(`/enquiries/${id}/follow-up`, {
        stage,
        subStage,
        stageReason,
        followUpDate: followUpDate || undefined,
        comment
      });
      // Refresh
      const res = await api.get(`/enquiries/${id}`);
      if (res.data.success) {
        setEnquiry(res.data.data);
      }
      setActiveTab('history');
      setComment('');
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to add follow up', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading...</div>;
  }

  const historyData = enquiry?.followUps || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 pt-4">
      <h1 className="text-[22px] font-normal text-slate-800 mb-6">Online Enquiry Follow-Up</h1>

      <Card className="border-slate-200 shadow-sm rounded-sm bg-[#f9f9f9]">
        <CardContent className="p-6">
          
          {/* Top Read-only fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mb-8">
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <Label className="text-right text-slate-600 font-normal text-[13px]">Enquirer Name</Label>
              <Input value={enquiry?.enquirerName || ''} readOnly className="h-8 text-[13px] border-slate-300 shadow-none rounded-sm bg-[#f5f5f5]" />
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <Label className="text-right text-slate-600 font-normal text-[13px]">Enquirer Mobile</Label>
              <Input value={enquiry?.enquirerMobile || ''} readOnly className="h-8 text-[13px] border-slate-300 shadow-none rounded-sm bg-[#f5f5f5]" />
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <Label className="text-right text-slate-600 font-normal text-[13px]">Program Name</Label>
              <Input value={enquiry?.program?.name || ''} readOnly className="h-8 text-[13px] border-slate-300 shadow-none rounded-sm bg-[#f5f5f5]" />
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <Label className="text-right text-slate-600 font-normal text-[13px]">Enquiry Date</Label>
              <Input value={enquiry?.createdAt ? new Date(enquiry.createdAt).toLocaleDateString() : ''} readOnly className="h-8 text-[13px] border-slate-300 shadow-none rounded-sm bg-[#f5f5f5]" />
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <Label className="text-right text-slate-600 font-normal text-[13px]">Gender</Label>
              <RadioGroup value={enquiry?.student?.gender?.toLowerCase() || 'boy'} className="flex gap-4 items-center h-8">
                <div className="flex items-center space-x-1.5 opacity-60">
                  <RadioGroupItem value="boy" id="boy" disabled />
                  <Label htmlFor="boy" className="font-normal text-[13px]">Boy</Label>
                </div>
                <div className="flex items-center space-x-1.5 opacity-60">
                  <RadioGroupItem value="girl" id="girl" disabled />
                  <Label htmlFor="girl" className="font-normal text-[13px]">Girl</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <Label className="text-right text-slate-600 font-normal text-[13px]">Student Name</Label>
              <Input value={`${enquiry?.student?.firstName || ''} ${enquiry?.student?.lastName || ''}`.trim()} readOnly className="h-8 text-[13px] border-slate-300 shadow-none rounded-sm bg-[#f5f5f5]" />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex mb-4">
            <Button
              variant="ghost"
              onClick={() => setActiveTab('history')}
              className={`rounded-sm h-9 px-4 text-[13px] font-semibold ${
                activeTab === 'history' 
                  ? 'bg-[#007bff] hover:bg-[#0069d9] text-white' 
                  : 'bg-[#e9ecef] hover:bg-[#dde2e6] text-slate-700'
              }`}
            >
              Follow Up History
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab('new')}
              className={`rounded-sm h-9 px-4 text-[13px] font-semibold ${
                activeTab === 'new' 
                  ? 'bg-[#007bff] hover:bg-[#0069d9] text-white' 
                  : 'bg-[#e9ecef] hover:bg-[#dde2e6] text-slate-700'
              }`}
            >
              New Follow Up
            </Button>
          </div>

          <div className="bg-white border border-slate-300 p-0 shadow-sm rounded-sm">
            {activeTab === 'history' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f0f0f0]">
                      <th className="py-2.5 px-4 border-b border-slate-300 text-[13px] font-semibold text-slate-700 w-[12%]">Activity Date</th>
                      <th className="py-2.5 px-4 border-b border-slate-300 text-[13px] font-semibold text-slate-700 w-[12%]">Follow-up Date</th>
                      <th className="py-2.5 px-4 border-b border-slate-300 text-[13px] font-semibold text-slate-700 w-[12%]">Stage</th>
                      <th className="py-2.5 px-4 border-b border-slate-300 text-[13px] font-semibold text-slate-700 w-[20%]">Sub Stage</th>
                      <th className="py-2.5 px-4 border-b border-slate-300 text-[13px] font-semibold text-slate-700 w-[12%]">Stage Reason</th>
                      <th className="py-2.5 px-4 border-b border-slate-300 text-[13px] font-semibold text-slate-700">Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyData.length === 0 ? (
                      <tr><td colSpan={6} className="py-4 px-4 text-[13px] text-slate-600 text-center">No follow up history found.</td></tr>
                    ) : (
                      historyData.map((row: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 border-b border-slate-200 text-[13px] text-slate-700 align-top">
                            {new Date(row.activityDate).toLocaleDateString()}
                          </td>
                          <td className="py-2.5 px-4 border-b border-slate-200 text-[13px] text-slate-700 align-top">
                            {row.followUpDate ? new Date(row.followUpDate).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="py-2.5 px-4 border-b border-slate-200 text-[13px] text-slate-700 align-top">{row.stage}</td>
                          <td className="py-2.5 px-4 border-b border-slate-200 text-[13px] text-slate-700 align-top">{row.subStage}</td>
                          <td className="py-2.5 px-4 border-b border-slate-200 text-[13px] text-slate-700 align-top">{row.stageReason}</td>
                          <td className="py-2.5 px-4 border-b border-slate-200 text-[13px] text-slate-700 align-top">{row.comment}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <form onSubmit={handleSave} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                  <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                    <Label className="text-right text-slate-600 font-normal text-[13px]">Stage</Label>
                    <Select value={stage} onValueChange={setStage}>
                      <SelectTrigger className="h-8 text-[13px] border-slate-300 shadow-none rounded-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Interested">Interested</SelectItem>
                        <SelectItem value="Follow Up">Follow Up</SelectItem>
                        <SelectItem value="Enrolled">Enrolled</SelectItem>
                        <SelectItem value="Lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="hidden md:block"></div>

                  <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                    <Label className="text-right text-slate-600 font-normal text-[13px]">Sub Stage</Label>
                    <Select value={subStage} onValueChange={setSubStage}>
                      <SelectTrigger className="h-8 text-[13px] border-slate-300 shadow-none rounded-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admission Enquiry (New Opportunity)">Admission Enquiry (New Opportunity)</SelectItem>
                        <SelectItem value="Callback Requested">Callback Requested</SelectItem>
                        <SelectItem value="Trial Class Scheduled">Trial Class Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="hidden md:block"></div>

                  <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                    <Label className="text-right text-slate-600 font-normal text-[13px]">Stage Reason</Label>
                    <Select value={stageReason} onValueChange={setStageReason}>
                      <SelectTrigger className="h-8 text-[13px] border-slate-300 shadow-none rounded-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Walk-in Visit">Walk-in Visit</SelectItem>
                        <SelectItem value="Phone Inquiry">Phone Inquiry</SelectItem>
                        <SelectItem value="Need Time">Need Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="hidden md:block"></div>

                  <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                    <Label className="text-right text-slate-600 font-normal text-[13px]">Follow up Date</Label>
                    <Input type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} className="h-8 text-[13px] border-slate-300 shadow-none rounded-sm w-[200px]" />
                  </div>
                  <div className="hidden md:block"></div>

                  <div className="grid grid-cols-[120px_1fr] items-start gap-4 md:col-span-2">
                    <Label className="text-right text-slate-600 font-normal text-[13px] mt-2">Comment <span className="text-red-500">*</span></Label>
                    <Textarea 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add follow-up notes here..." 
                      className="min-h-[80px] text-[13px] border-slate-300 shadow-none rounded-sm resize-none w-full max-w-[600px]" 
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 pl-[136px]">
                  <Button type="submit" disabled={isSaving} className="bg-[#0056b3] hover:bg-[#004494] text-white h-8 px-6 text-[13px] shadow-none rounded-sm font-medium">
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button type="button" onClick={() => navigate('/enquiry')} className="bg-[#e9ecef] hover:bg-[#dde2e6] text-slate-700 h-8 px-6 text-[13px] shadow-none rounded-sm font-medium">
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
