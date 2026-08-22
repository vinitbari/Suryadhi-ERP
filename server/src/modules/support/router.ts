import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../config/database';
import { authenticate, schoolScope } from '../../middleware';

const router = Router();
router.use(authenticate);
router.use(schoolScope);

// GET /api/support/tickets - Get helpdesk support tickets
router.get('/tickets', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schoolId = req.user?.schoolId || undefined;

    const tickets = [
      { id: '1', ticketNo: 'Ticket no-338408', subject: 'T Shirt Replacement', category: 'Operations', date: '28-May-2026', status: 'Closed', remarks: 'Replacement dispatched via courier.' },
      { id: '2', ticketNo: 'Ticket no-338407', subject: 'T shirt replacement', category: 'Operations', date: '28-May-2026', status: 'Closed', remarks: 'Size exchange processed.' },
      { id: '3', ticketNo: 'Ticket no-332420', subject: 'Program Change', category: 'Academics', date: '01-May-2026', status: 'Closed', remarks: 'Program updated from Play Group to Nursery.' },
      { id: '4', ticketNo: 'Ticket no-332419', subject: 'Program Changes', category: 'Academics', date: '01-May-2026', status: 'Closed', remarks: 'Batch allocation completed.' },
      { id: '5', ticketNo: 'Ticket no-332421', subject: 'Program Change', category: 'Academics', date: '01-May-2026', status: 'Closed', remarks: 'Approved by Zonal Manager.' },
      { id: '6', ticketNo: 'Ticket no-322179', subject: 'Quit admission', category: 'Admission', date: '24-Mar-2026', status: 'Closed', remarks: 'Refund cleared per policy.' },
      { id: '7', ticketNo: 'Ticket no-303957', subject: 'name change reg', category: 'Administration', date: '15-Feb-2026', status: 'Resolved', remarks: 'Name change certificate updated.' },
      { id: '8', ticketNo: 'Ticket no-293134', subject: 'father name change', category: 'Administration', date: '10-Jan-2026', status: 'Open', remarks: 'Verification documents pending.' },
    ];

    res.json({
      success: true,
      data: tickets,
    });
  } catch (error) { next(error); }
});

// POST /api/support/tickets - Create a new helpdesk ticket
router.post('/tickets', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subject, mainCategory, subCategory, description, email, phone } = req.body;
    const ticketNo = `Ticket no-${Math.floor(100000 + Math.random() * 900000)}`;

    const newTicket = {
      id: String(Date.now()),
      ticketNo,
      subject: subject || 'General Query',
      category: mainCategory || 'Support',
      subCategory: subCategory || 'General',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'),
      status: 'Open',
      email,
      phone,
      description,
    };

    res.status(201).json({
      success: true,
      message: 'Support ticket raised successfully',
      data: newTicket,
    });
  } catch (error) { next(error); }
});

// GET /api/support/videos - Get video library training and guidelines
router.get('/videos', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, search } = req.query;

    const allVideos = [
      { id: '1', title: 'Suryadhi SEMS — Pre-School Setup & Onboarding Guidelines', category: 'Operations', duration: '12:45', thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400&h=250', new: true, description: 'Step-by-step onboarding guidelines for classroom setup, signage, safety norms, and teacher readiness.' },
      { id: '2', title: 'Admissions Module Training & CRM Workflow', category: 'Training', duration: '45:20', thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400&h=250', new: false, description: 'Comprehensive guide to managing student walk-ins, conversion stages, advance receipts, and registration forms.' },
      { id: '3', title: 'Curriculum Implementation & Milestone Tracking Q1', category: 'Academics', duration: '30:15', thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400&h=250', new: true, description: 'Academic plan execution across Play Group, Nursery, SUNOIA Junior, and SUNOIA Senior programs.' },
      { id: '4', title: 'Fee Collection Best Practices & Deposit Slips', category: 'Finance', duration: '18:10', thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400&h=250', new: false, description: 'Daily cash reconciliation, bank deposit slips generation, and handling online payments integration.' },
      { id: '5', title: 'Parent Communication Strategies & App Engagement', category: 'Training', duration: '22:30', thumbnail: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=400&h=250', new: false, description: 'Effective messaging techniques, circulars distribution, and event announcements via the parent app.' },
      { id: '6', title: 'Safety, First Aid & Hygiene Protocols', category: 'Operations', duration: '15:00', thumbnail: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=400&h=250', new: false, description: 'CCTV management, child protection policies, emergency evacuation drills, and sanitization standards.' },
    ];

    let filtered = allVideos;
    if (category && typeof category === 'string' && category !== 'All Videos' && category !== 'All') {
      filtered = filtered.filter(v => v.category.toLowerCase() === category.toLowerCase());
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(v => v.title.toLowerCase().includes(q) || v.category.toLowerCase().includes(q) || v.description.toLowerCase().includes(q));
    }

    res.json({
      success: true,
      data: filtered,
    });
  } catch (error) { next(error); }
});

export default router;
