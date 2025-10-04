import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Upload, Send } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { uploadFile } from '@/api/uploadFile';
import { getLeavePolicies, LeavePolicy } from '@/api/leavePolicy';
import { createLeaveRequest, getLeaveRequests, LeaveRequestsResponse } from '@/api/leaves';
import { Badge } from '@/components/ui/badge';

const ApplyLeave = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [leavePolicies, setLeavePolicies] = useState<LeavePolicy[]>([]);
  const [leaveTypeId, setLeaveTypeId] = useState<string>('');
  const [leaveTypeLabel, setLeaveTypeLabel] = useState<string>('');
  const [leavePolicyId, setLeavePolicyId] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [days, setDays] = useState<number>(0);
  const [reason, setReason] = useState('');
  const [documentUrl, setDocumentUrl] = useState<string | undefined>();
  const [documentPreview, setDocumentPreview] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requests, setRequests] = useState<LeaveRequestsResponse | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  // Compute days when dates chosen
  useEffect(() => {
    if (startDate && endDate) {
      const diff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      setDays(diff > 0 ? diff : 0);
    } else {
      setDays(0);
    }
  }, [startDate, endDate]);

  // Fetch leave types when user opens the dropdown
  const handleOpenLeaveType = async () => {
    try {
      const res = await getLeavePolicies();
      const policies = Array.isArray(res?.data) ? res.data : [];
      setLeavePolicies(policies);
    } catch (err) {
      console.error('Failed to load leave policies', err);
    }
  };

  const leaveTypeItems = useMemo(() => {
    const items: { id: string; type: string; policyId: string }[] = [];
    leavePolicies.forEach((p) => {
      p.leaveTypes.forEach((lt) => {
        if (lt._id) items.push({ id: lt._id, type: lt.type, policyId: p._id });
      });
    });
    return items;
  }, [leavePolicies]);

  const handleLeaveTypeSelect = (value: string) => {
    const found = leaveTypeItems.find((i) => i.id === value);
    if (found) {
      setLeaveTypeId(found.id);
      setLeaveTypeLabel(found.type);
      setLeavePolicyId(found.policyId);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setDocumentUrl(url);
      // Show preview for images only
      if (file.type.startsWith('image/')) {
        setDocumentPreview(url);
      } else {
        setDocumentPreview(undefined);
      }
    } catch (err) {
      console.error('File upload failed', err);
      alert('File upload failed');
    } finally {
      setUploading(false);
      // reset file input value
      e.currentTarget.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const employeeId = user?._id || user?.id;
    if (!employeeId || !startDate || !endDate || !leaveTypeId || !leavePolicyId) {
      alert('Please complete all fields');
      return;
    }
    const payload = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      reason,
      leavePolicyId,
      leaveTypeId,
      leaveType: leaveTypeLabel,
      days,
      employeeId,
      documentUrl,
    };
    setSubmitting(true);
    try {
      await createLeaveRequest(payload);
      setShowForm(false);
      fetchRequests();
    } catch (err: any) {
      console.error('Submit failed', err);
      alert(err?.response?.data?.message || 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchRequests = async (page: number = 1) => {
    try {
      const id = user?._id || user?.id;
      const res = await getLeaveRequests(page, 10, statusFilter || undefined, id ? [id] : undefined);
      setRequests(res);
    } catch (err) {
      console.error('Failed to load leave requests', err);
    }
  };

  useEffect(() => {
    if (!showForm) fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, typeFilter]);

  const renderForm = () => (
    <Card className="max-w-4xl mx-auto rounded-2xl shadow-lg bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Apply for Leave</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Leave Type</Label>
            <Select onOpenChange={(open) => open && handleOpenLeaveType()} value={leaveTypeId} onValueChange={handleLeaveTypeSelect}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                {leaveTypeItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>{item.type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !startDate && 'text-muted-foreground')}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : 'Pick date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus className="pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !endDate && 'text-muted-foreground')}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : 'Pick date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus className="pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Total Leave days</Label>
              <div className="h-10 border rounded-md flex items-center px-3 bg-muted/50">{days || '-'}</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Reason</Label>
            <Textarea rows={4} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for leave" />
          </div>

          <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
            <div className="h-20 border rounded-lg bg-muted/30 flex items-center justify-center overflow-hidden">
              {documentPreview ? (
                <img src={documentPreview} alt="uploaded" className="h-full w-full object-cover" />
              ) : (
                <Upload className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex items-center gap-3">
              <input type="file" accept="image/*,.pdf,.doc,.docx" onChange={handleFileChange} />
              {documentUrl && !documentPreview && (
                <span className="text-sm text-muted-foreground">File attached</span>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="hrms-button-primary" disabled={submitting || uploading}>
              <Send className="mr-2 h-4 w-4" />
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const statusToBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'approved') return <Badge className="hrms-status-success">Approved</Badge>;
    if (s === 'pending' || s === 'applied') return <Badge className="hrms-status-warning">Pending</Badge>;
    if (s === 'rejected' || s === 'declined') return <Badge className="hrms-status-error">Declined</Badge>;
    return <Badge>{status}</Badge>;
  };

  const renderTable = () => (
    <div className="max-w-5xl mx-auto">
      {requests?.items?.[0]?.employeeId && (
        <div className="flex items-center gap-3 mb-4">
          <img
            src={(requests.items[0].employeeId as any).profilePhotoUrl}
            alt="profile"
            className="h-10 w-10 rounded-full object-cover"
            onError={(e) => ((e.currentTarget.src = '/placeholder.svg'))}
          />
          <div>
            <div className="font-semibold">
              {(requests.items[0].employeeId as any).firstName} {(requests.items[0].employeeId as any).lastName}
            </div>
            <div className="text-xs text-muted-foreground">{(requests.items[0].employeeId as any).employeeCode}</div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Track Leave request</h2>
        <Button className="hrms-button-primary" onClick={() => setShowForm(true)}>Request Leave</Button>
      </div>
      <div className="flex gap-3 mb-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="rejected">Declined</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Leave type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {leaveTypeItems.map((i) => (
              <SelectItem key={i.id} value={i.type}>{i.type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="ghost" onClick={() => { setStatusFilter(''); setTypeFilter(''); }}>Clear filters</Button>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="bg-[#23292F] text-white">
            <tr>
              <th className="p-3 text-left">Leave type</th>
              <th className="p-3 text-left">Start date</th>
              <th className="p-3 text-left">End date</th>
              <th className="p-3 text-left">Reason</th>
              <th className="p-3 text-left">Total days</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Add Remark</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests?.items?.filter((itm) =>
              ((typeFilter === '' || typeFilter === 'all') || itm.leaveType === typeFilter) &&
              ((statusFilter === '' || statusFilter === 'all') || itm.status === statusFilter)
            ).map((itm) => (
              <tr key={itm._id} className="odd:bg-white even:bg-muted/30">
                <td className="p-3">{itm.leaveType}</td>
                <td className="p-3">{format(new Date(itm.startDate), 'do MMMM')}</td>
                <td className="p-3">{format(new Date(itm.endDate), 'do MMMM')}</td>
                <td className="p-3">{itm.reason}</td>
                <td className="p-3">{itm.days} days</td>
                <td className="p-3">{statusToBadge(itm.status)}</td>
                <td className="p-3 text-muted-foreground">-</td>
                <td className="p-3 text-blue-600">{itm.status === 'pending' ? 'Cancel request' : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-3 text-sm">
        <div>Prev</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">1</Button>
          <span>2</span><span>3</span><span>…</span><span>10</span>
        </div>
        <div>Next</div>
      </div>
    </div>
  );

  // Gate to companyAdmin role UI
  if (user?.role !== 'companyAdmin') {
    return (
      <div className="p-6"><h2 className="text-xl font-semibold">Access restricted</h2></div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 to-green-50 py-6 px-4">
      {showForm ? renderForm() : renderTable()}
    </div>
  );
};

export default ApplyLeave;