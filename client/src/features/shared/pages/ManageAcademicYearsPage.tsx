import { useState, useEffect, useCallback } from 'react';
import { BRAND } from '@/lib/brand';
import apiClient from '@/lib/api-client';
import { useUIStore } from '@/store';
import { showToast } from '@/lib/toast';
import {
  CalendarDays, Plus, Pencil, Trash2, CheckCircle2,
  Star, Loader2, AlertTriangle, X, Save, RefreshCw
} from 'lucide-react';

interface AcademicYear {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

interface YearForm {
  label: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

const emptyForm: YearForm = { label: '', startDate: '', endDate: '', isCurrent: false };

function formatDate(dateStr: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ManageAcademicYearsPage() {
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<YearForm>(emptyForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/lookups/academic-years');
      if (res.data.success) setYears(res.data.data);
    } catch {
      showToast('Failed to load academic years', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(y: AcademicYear) {
    setEditingId(y.id);
    setForm({
      label: y.label,
      startDate: y.startDate?.split('T')[0] ?? '',
      endDate: y.endDate?.split('T')[0] ?? '',
      isCurrent: y.isCurrent,
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSave() {
    if (!form.label.trim() || !form.startDate || !form.endDate) {
      showToast('Label, Start Date, and End Date are required', 'error');
      return;
    }
    if (new Date(form.startDate) >= new Date(form.endDate)) {
      showToast('End date must be after start date', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await apiClient.put(`/lookups/academic-years/${editingId}`, form);
        showToast('Academic year updated successfully', 'success');
      } else {
        await apiClient.post('/lookups/academic-years', form);
        showToast('Academic year created successfully', 'success');
      }
      closeForm();
      load();
    } catch (e: any) {
      showToast(e?.response?.data?.error || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleSetCurrent(id: string) {
    try {
      await apiClient.post(`/lookups/academic-years/${id}/set-current`);
      showToast('Current academic year updated', 'success');
      load();
    } catch {
      showToast('Failed to set current year', 'error');
    }
  }

  async function handleDelete(id: string) {
    const year = years.find(y => y.id === id);
    if (year?.isCurrent) {
      showToast('Cannot delete the current active academic year', 'error');
      setDeleteConfirmId(null);
      return;
    }
    try {
      await apiClient.delete(`/lookups/academic-years/${id}`);
      showToast('Academic year deleted', 'success');
      setDeleteConfirmId(null);
      load();
    } catch {
      showToast('Failed to delete academic year', 'error');
    }
  }

  return (
    <div className="max-w-5xl mx-auto pb-16 pt-2 space-y-6">
      {/* ── Header ─── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
              <CalendarDays className="h-5 w-5 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Academic Year Management</h1>
          </div>
          <p className="text-sm text-slate-500 ml-11">
            Add, edit, or remove academic years for {BRAND.companyName}. Set the active year used across all modules.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={load}
            className="h-9 w-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 h-9 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Academic Year
          </button>
        </div>
      </div>

      {/* ── Active Year Banner ─── */}
      {(() => {
        const current = years.find(y => y.isCurrent);
        if (!current) return null;
        return (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 border border-green-200">
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
            <div>
              <span className="text-sm font-semibold text-green-800">Currently Active Year: </span>
              <span className="text-sm text-green-700">{current.label}</span>
              <span className="text-xs text-green-600 ml-2">
                ({formatDate(current.startDate)} — {formatDate(current.endDate)})
              </span>
            </div>
          </div>
        );
      })()}

      {/* ── Table ─── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 gap-3 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-sm">Loading academic years…</span>
          </div>
        ) : years.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <CalendarDays className="h-10 w-10 text-slate-200 mb-3" />
            <p className="text-slate-500 font-medium">No academic years found</p>
            <p className="text-xs text-slate-400 mt-1">Click "Add Academic Year" to create the first one</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Label</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Start Date</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">End Date</th>
                <th className="text-center px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Status</th>
                <th className="text-right px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {years.map((y) => (
                <tr key={y.id} className={`hover:bg-slate-50/50 transition-colors ${y.isCurrent ? 'bg-green-50/30' : ''}`}>
                  <td className="px-5 py-3.5 font-medium text-slate-800">
                    <span className="flex items-center gap-2">
                      {y.isCurrent && <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-400 shrink-0" />}
                      {y.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{formatDate(y.startDate)}</td>
                  <td className="px-5 py-3.5 text-slate-600">{formatDate(y.endDate)}</td>
                  <td className="px-5 py-3.5 text-center">
                    {y.isCurrent ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Active
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetCurrent(y.id)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-slate-200 text-slate-500 text-xs hover:border-green-400 hover:text-green-700 hover:bg-green-50 transition-all"
                        title="Set as current"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Set Active
                      </button>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(y)}
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      {!y.isCurrent && (
                        deleteConfirmId === y.id ? (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-red-500 mr-1">Confirm?</span>
                            <button
                              onClick={() => handleDelete(y.id)}
                              className="h-7 px-2 rounded text-xs bg-red-600 text-white hover:bg-red-700 transition-colors"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="h-7 px-2 rounded text-xs border text-slate-500 hover:bg-slate-50 transition-colors"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(y.id)}
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Form Modal ─── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  {editingId ? 'Edit Academic Year' : 'Add New Academic Year'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {editingId ? 'Update the label or dates below.' : 'Fill in the details to create a new academic year.'}
                </p>
              </div>
              <button
                onClick={closeForm}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Label */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.label}
                  onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                  placeholder="e.g. Apr 26 - Mar 27 or Apr 26 - Mar 27 (MTA)"
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Examples: <code className="bg-slate-100 px-1 rounded">Apr 26 - Mar 27</code>, <code className="bg-slate-100 px-1 rounded">Apr 26 - Mar 27 (MTA)</code>, <code className="bg-slate-100 px-1 rounded">Apr 26 - Mar 27 (MYP)</code>
                </p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  />
                </div>
              </div>

              {/* Set as current */}
              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  checked={form.isCurrent}
                  onChange={e => setForm(f => ({ ...f, isCurrent: e.target.checked }))}
                  className="h-4 w-4 rounded accent-blue-600"
                />
                <div>
                  <span className="text-sm font-medium text-slate-700">Set as current active year</span>
                  <p className="text-xs text-slate-400">This will deactivate any other currently active year.</p>
                </div>
              </label>

              {form.isCurrent && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-700">
                    All modules (Enquiry, Admission, Fee, Reports) will default to this academic year when selected.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={closeForm}
                className="px-4 h-9 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 h-9 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                {saving ? 'Saving…' : editingId ? 'Update Year' : 'Create Year'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Info Card ─── */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 text-sm text-blue-700 space-y-2">
        <p className="font-semibold text-blue-800 flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          How Academic Years work in {BRAND.systemAbbr}
        </p>
        <ul className="list-disc list-inside space-y-1 text-xs text-blue-600">
          <li>Every Enquiry, Admission, Fee and Report is linked to an Academic Year.</li>
          <li>The <strong>Active Year</strong> is pre-selected in all forms automatically.</li>
          <li>Add variants like <strong>(MTA)</strong> or <strong>(MYP)</strong> for Mid-Term Admissions or Mid-Year Programs.</li>
          <li>Deleting a year with existing admissions is not allowed — archive it instead.</li>
          <li>After creating a year, it is automatically linked to all active schools.</li>
        </ul>
      </div>
    </div>
  );
}
