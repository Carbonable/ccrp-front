export type NotificationType = 'project' | 'stock' | 'critical' | 'update' | 'deadline' | 'review';

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: NotificationType;
  date: string;
  read: boolean;
  href: string;
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Critical stock — Banegas Farm',
    description: 'Available carbon credits for "Banegas Farm" (Costa Rica) are below the critical threshold (< 500 tCO\u2082).',
    type: 'critical',
    date: '2026-03-19T10:30:00Z',
    read: false,
    href: '/projects/forest-regeneration-banegas-farm-costa-rica',
  },
  {
    id: '2',
    title: 'New project added — HeirZoom DAC',
    description: 'Project "HeirZoom" (Direct Air Capture, Iceland) has been added to the portfolio.',
    type: 'project',
    date: '2026-03-19T09:15:00Z',
    read: false,
    href: '/projects/heirzoom-dac-project-iceland',
  },
  {
    id: '3',
    title: 'Q1 2026 reporting deadline',
    description: 'The Q1 2026 quarterly report for Business Unit "Genzyme" is due in 5 days.',
    type: 'deadline',
    date: '2026-03-18T17:45:00Z',
    read: false,
    href: '/dashboard',
  },
  {
    id: '4',
    title: 'Approval requested — Medley allocation',
    description: 'An allocation review for Business Unit "Medley" is pending your approval.',
    type: 'review',
    date: '2026-03-18T14:00:00Z',
    read: false,
    href: '/dashboard/business-units-allocation',
  },
  {
    id: '5',
    title: 'Manjarisoa — Status validated',
    description: 'Project "Manjarisoa" (Madagascar) has moved from "In progress" to "Validated" after audit.',
    type: 'project',
    date: '2026-03-18T11:20:00Z',
    read: false,
    href: '/projects/forest-regeneration-manjarisoa-madagascar',
  },
  {
    id: '6',
    title: '2025 absorption import completed',
    description: 'The 2025 absorption data import for all 9 portfolio projects has been completed successfully.',
    type: 'update',
    date: '2026-03-17T16:00:00Z',
    read: true,
    href: '/dashboard',
  },
  {
    id: '7',
    title: 'Low stock — Las Delicias',
    description: 'Carbon credits for "Las Delicias" (Mangroves, Panama) are approaching the alert threshold (< 2,000 tCO\u2082).',
    type: 'stock',
    date: '2026-03-17T13:30:00Z',
    read: true,
    href: '/projects/mangroves-regeneration-las-delicias-panama',
  },
  {
    id: '8',
    title: 'Purchase deadline — Chaco Agroforestry',
    description: 'The purchase deadline for "Chaco Agroforestry" (Paraguay) expires in 3 days.',
    type: 'deadline',
    date: '2026-03-17T10:00:00Z',
    read: true,
    href: '/projects/forest-regeneration-chaco-agroforestry-paraguay',
  },
  {
    id: '9',
    title: 'Financial analysis available',
    description: 'The "Financial Analysis" module has been updated with Q4 2025 data for all Business Units.',
    type: 'update',
    date: '2026-03-16T09:00:00Z',
    read: true,
    href: '/dashboard',
  },
  {
    id: '10',
    title: 'Review requested — Bokpyn-Karathuru',
    description: 'The Risk team requests a review of "Bokpyn-Karathuru" (Mangroves, Myanmar) before final validation.',
    type: 'review',
    date: '2026-03-15T15:45:00Z',
    read: true,
    href: '/projects/mangroves-regeneration-karathuru-myanmar',
  },
  {
    id: '11',
    title: 'Planned retirement — Braulio Carrillo',
    description: 'A retirement of 10,000 tCO\u2082 from "Braulio Carrillo" (Costa Rica) is scheduled in 7 days.',
    type: 'deadline',
    date: '2026-03-15T12:00:00Z',
    read: true,
    href: '/projects/forest-regeneration-baum-invest-restoration-project-costa-rica',
  },
  {
    id: '12',
    title: 'Bhadia ALSP — New vintage 2026',
    description: 'Vintage 2026 for "Bhadia ALSP" (Solar Panel, India) has been created with 15,000 tCO\u2082 capacity.',
    type: 'project',
    date: '2026-03-14T08:30:00Z',
    read: true,
    href: '/projects/solar-panel-India-bhadia-alsp',
  },
];
