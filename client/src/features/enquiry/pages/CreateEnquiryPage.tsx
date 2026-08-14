import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { ArrowLeft, Loader2, Save, User, CalendarDays, UserSquare2, Info } from 'lucide-react';
import api from '@/api/client';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { showToast } from '@/lib/toast';

const enquiryFormSchema = z.object({
  enquirerMobile: z.string().min(10, 'Valid mobile number required'),
  enquirerName: z.string().min(1, 'Enquirer name is required'),
  enquirerEmail: z.string().email('Valid email required').or(z.literal('')),
  enquirerAddress: z.string().min(1, 'Address is required'),
  studentFirstName: z.string().min(1, 'First name is required'),
  studentMiddleName: z.string().optional(),
  studentLastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['BOY', 'GIRL']),
  programId: z.string().min(1, 'Program is required'),
  hasSibling: z.boolean(),
  isTrialClass: z.boolean(),
  mediaSourceId: z.string().optional(),
  academicYearId: z.string().min(1, 'Academic year is required'),
});

type EnquiryFormData = z.infer<typeof enquiryFormSchema>;

export default function CreateEnquiryPage() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [mediaSources, setMediaSources] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquiryFormSchema),
    defaultValues: {
      hasSibling: false,
      isTrialClass: false,
      gender: 'BOY',
    },
  });

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [progRes, yearRes, sourceRes] = await Promise.all([
          api.get('/lookups/programs'),
          api.get('/lookups/academic-years'),
          api.get('/lookups/media-sources')
        ]);
        
        if (progRes.data.success) setPrograms(progRes.data.data);
        if (yearRes.data.success) {
          setAcademicYears(yearRes.data.data);
          const current = yearRes.data.data.find((y: any) => y.isCurrent);
          if (current) setValue('academicYearId', current.id);
        }
        if (sourceRes.data.success) setMediaSources(sourceRes.data.data);
      } catch (error) {
        console.warn('Failed to fetch lookups, falling back to dummy data', error);
        setPrograms([
          { id: '1', name: 'Play Group' },
          { id: '2', name: 'Nursery' },
          { id: '3', name: 'SUNOIA Junior' },
          { id: '4', name: 'SUNOIA Senior' }
        ]);
        setAcademicYears([
          { id: '1', label: 'Apr 26 - Mar 27', isCurrent: true }
        ]);
        setMediaSources([
          { id: '1', name: 'Walk-in' },
          { id: '2', name: 'Website' },
          { id: '3', name: 'Referral' },
          { id: '4', name: 'Social Media' }
        ]);
        setValue('academicYearId', '1');
      }
    };
    
    fetchLookups();
  }, [setValue]);

  const onSubmit = async (data: EnquiryFormData) => {
    setIsSubmitting(true);
    try {
      await api.post('/enquiries', data);
      navigate('/enquiry');
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to create enquiry', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelClass = 'block text-sm font-medium text-foreground/80 mb-1.5';
  const errorClass = 'text-[11px] text-destructive mt-1 font-medium';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full bg-muted/50 hover:bg-muted">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader 
          title="Create Enquiry" 
          description="Register a new pre-admission enquiry in the system"
          className="mb-0"
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enquirer Information */}
          <Card>
            <CardHeader className="bg-muted/30 border-b border-border/50">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Enquirer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Mobile No *</label>
                <Input {...register('enquirerMobile')} placeholder="Enter mobile number" />
                {errors.enquirerMobile && <p className={errorClass}>{errors.enquirerMobile.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Enquirer Name *</label>
                <Input {...register('enquirerName')} placeholder="Enter enquirer name" />
                {errors.enquirerName && <p className={errorClass}>{errors.enquirerName.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Email Address</label>
                <Input {...register('enquirerEmail')} placeholder="Enter email address" />
                {errors.enquirerEmail && <p className={errorClass}>{errors.enquirerEmail.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Residential Address *</label>
                <Input {...register('enquirerAddress')} placeholder="Enter full address" />
                {errors.enquirerAddress && <p className={errorClass}>{errors.enquirerAddress.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Academic Info */}
          <Card>
            <CardHeader className="bg-muted/30 border-b border-border/50">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Academic Year *</label>
                <select {...register('academicYearId')} className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary">
                  <option value="">Select Academic Year</option>
                  {academicYears.map((y) => (
                    <option key={y.id} value={y.id}>{y.label}</option>
                  ))}
                </select>
                {errors.academicYearId && <p className={errorClass}>{errors.academicYearId.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Enquiry Date</label>
                <Input value={new Date().toLocaleDateString('en-IN')} readOnly className="bg-muted/50 text-muted-foreground" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Program Seeking *</label>
                <select {...register('programId')} className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary">
                  <option value="">Select Program</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                {errors.programId && <p className={errorClass}>{errors.programId.message}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Information */}
        <Card>
          <CardHeader className="bg-muted/30 border-b border-border/50">
            <CardTitle className="text-base flex items-center gap-2">
              <UserSquare2 className="h-4 w-4 text-primary" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>First Name *</label>
              <Input {...register('studentFirstName')} placeholder="First name" />
              {errors.studentFirstName && <p className={errorClass}>{errors.studentFirstName.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Middle Name</label>
              <Input {...register('studentMiddleName')} placeholder="Middle name (optional)" />
            </div>
            <div>
              <label className={labelClass}>Last Name *</label>
              <Input {...register('studentLastName')} placeholder="Last name" />
              {errors.studentLastName && <p className={errorClass}>{errors.studentLastName.message}</p>}
            </div>
            
            <div>
              <label className={labelClass}>Date of Birth *</label>
              <Input type="date" {...register('dateOfBirth')} />
              {errors.dateOfBirth && <p className={errorClass}>{errors.dateOfBirth.message}</p>}
            </div>
            
            <div>
              <label className={labelClass}>Gender *</label>
              <div className="flex flex-wrap gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="radio" value="BOY" {...register('gender')} className="peer sr-only" />
                    <div className="w-4 h-4 rounded-full border border-primary peer-checked:border-primary peer-checked:border-[4px] transition-all"></div>
                  </div>
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">Boy</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="radio" value="GIRL" {...register('gender')} className="peer sr-only" />
                    <div className="w-4 h-4 rounded-full border border-primary peer-checked:border-primary peer-checked:border-[4px] transition-all"></div>
                  </div>
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">Girl</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card>
          <CardHeader className="bg-muted/30 border-b border-border/50">
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Has Sibling in SUNOIA / SEMS? *</label>
              <div className="flex flex-wrap gap-4 mt-2">
                {[true, false].map((val) => (
                  <label key={String(val)} className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="radio" 
                        checked={watch('hasSibling') === val}
                        onChange={() => setValue('hasSibling', val)} 
                        className="peer sr-only" 
                      />
                      <div className="w-4 h-4 rounded-full border border-primary peer-checked:border-primary peer-checked:border-[4px] transition-all"></div>
                    </div>
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{val ? 'Yes' : 'No'}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Trial Class Selected? *</label>
              <div className="flex flex-wrap gap-4 mt-2">
                {[true, false].map((val) => (
                  <label key={String(val)} className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="radio" 
                        checked={watch('isTrialClass') === val}
                        onChange={() => setValue('isTrialClass', val)} 
                        className="peer sr-only" 
                      />
                      <div className="w-4 h-4 rounded-full border border-primary peer-checked:border-primary peer-checked:border-[4px] transition-all"></div>
                    </div>
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{val ? 'Yes' : 'No'}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>How did you hear about us?</label>
              <select {...register('mediaSourceId')} className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary">
                <option value="">Select Source</option>
                {mediaSources.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 sticky bottom-4 bg-card/80 backdrop-blur-xl p-4 rounded-xl border border-border shadow-lg z-10">
          <Button variant="outline" type="button" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Enquiry
          </Button>
        </div>
      </form>
    </div>
  );
}
