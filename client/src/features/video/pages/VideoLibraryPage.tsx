import { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlayCircle, Clock, Search, BookOpen, Layers, Loader2, Video, X } from 'lucide-react';
import api from '@/api/client';

interface VideoItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  thumbnail: string;
  new?: boolean;
  description?: string;
}

const defaultVideos: VideoItem[] = [
  { id: '1', title: 'Suryadhi SEMS — Pre-School Setup & Onboarding Guidelines', category: 'Operations', duration: '12:45', thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400&h=250', new: true, description: 'Step-by-step onboarding guidelines for classroom setup, safety norms, and teacher readiness.' },
  { id: '2', title: 'Admissions Module Training & CRM Workflow', category: 'Training', duration: '45:20', thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400&h=250', new: false, description: 'Comprehensive guide to managing student walk-ins and registration forms.' },
  { id: '3', title: 'Curriculum Implementation & Milestone Tracking Q1', category: 'Academics', duration: '30:15', thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400&h=250', new: true, description: 'Academic plan execution across standard preschool programs.' },
  { id: '4', title: 'Fee Collection Best Practices & Deposit Slips', category: 'Finance', duration: '18:10', thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400&h=250', new: false, description: 'Daily cash reconciliation, bank deposit slips generation, and receipts.' },
  { id: '5', title: 'Parent Communication Strategies & App Engagement', category: 'Training', duration: '22:30', thumbnail: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=400&h=250', new: false, description: 'Effective messaging techniques and announcements via the app.' },
  { id: '6', title: 'Safety, First Aid & Hygiene Protocols', category: 'Operations', duration: '15:00', thumbnail: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=400&h=250', new: false, description: 'CCTV management, child protection policies, and sanitization standards.' },
];

export default function VideoLibraryPage() {
  const [videos, setVideos] = useState<VideoItem[]>(defaultVideos);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/support/videos', {
        params: {
          category: category !== 'All' ? category : undefined,
          search: search || undefined,
        },
      });
      if (res.data.success && Array.isArray(res.data.data)) {
        setVideos(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to load videos from server, using default library', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [category, search]);

  const categories = ['All', 'Academics', 'Training', 'Operations', 'Finance'];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Video Library"
        description="Access training materials, guidelines, and curriculum videos"
      >
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search videos..." 
            className="pl-9 bg-white" 
          />
        </div>
      </PageHeader>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={category === cat ? 'default' : 'outline'}
            size="sm"
            className={`rounded-full ${category === cat ? 'bg-blue-600 text-white' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
            onClick={() => setCategory(cat)}
          >
            {cat === 'All' && <Layers className="h-4 w-4 mr-2" />}
            {cat === 'Academics' && <BookOpen className="h-4 w-4 mr-2" />}
            {cat === 'All' ? 'All Videos' : cat}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
          <p className="text-sm text-slate-500">Loading video library...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <div key={video.id} onClick={() => setActiveVideo(video)}>
              <Card className="overflow-hidden group cursor-pointer border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all h-full flex flex-col bg-white">
                <div className="relative aspect-video overflow-hidden">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100 duration-300" />
                  </div>
                  {video.new && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="destructive" className="shadow-sm">NEW</Badge>
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-white text-[10px] font-mono rounded font-medium backdrop-blur-sm">
                    {video.duration}
                  </div>
                </div>
                <CardContent className="p-4 flex-1">
                  <Badge variant="secondary" className="mb-2 text-[10px] bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200">{video.category}</Badge>
                  <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">{video.title}</h3>
                  {video.description && (
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">{video.description}</p>
                  )}
                </CardContent>
                <CardFooter className="p-4 pt-0 border-t border-slate-100 mt-auto flex items-center justify-between text-muted-foreground">
                  <div className="flex items-center text-[11px] font-medium text-slate-500">
                    <Clock className="w-3 h-3 mr-1" /> HQ Training Asset
                  </div>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-slate-800 text-sm">{activeVideo.title}</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setActiveVideo(null)} className="h-8 w-8 p-0 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
              <img src={activeVideo.thumbnail} alt={activeVideo.title} className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <PlayCircle className="w-16 h-16 text-white/90 hover:scale-110 transition-transform cursor-pointer" />
                <p className="mt-3 text-sm font-medium">Click to Play Training Stream</p>
                <span className="text-xs text-slate-300 font-mono mt-1">Duration: {activeVideo.duration}</span>
              </div>
            </div>
            <div className="p-4 bg-white space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">{activeVideo.category}</Badge>
                <span className="text-xs text-slate-500">SEMS Authorized Training Material</span>
              </div>
              <p className="text-sm text-slate-600">{activeVideo.description || activeVideo.title}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
