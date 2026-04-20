/**
 * Static demo notifications — designed to look realistic for Carbonable CCRP demo.
 * Content specified by Guillaume (CAR-20).
 *
 * Each notification has a type for styling, a link to a real page, and
 * a relative timestamp anchor (hours before "now") so they always look fresh.
 */

export type NotificationType = 'milestone' | 'impact' | 'retirement' | 'stock' | 'allocation' | 'update' | 'approval' | 'status' | 'project';

export interface DemoNotification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  /** Relative link (resolved by next-intl Link) */
  href: string;
  /** Hours ago from "now" — keeps timestamps always fresh */
  hoursAgo: number;
  icon: string;
}

export const DEMO_NOTIFICATIONS: DemoNotification[] = [
  {
    id: 'notif-1',
    title: 'Net-Zero Road — Midway to your 2026 goal',
    body: 'Current allocations have helped you reach 54% of your goal. You\'re over halfway there.',
    type: 'milestone',
    href: '/dashboard',
    hoursAgo: 2,
    icon: '🎯',
  },
  {
    id: 'notif-2',
    title: 'Impact Report Update — Banegas Farm',
    body: 'The latest impact report for Banegas Farm is now available.',
    type: 'impact',
    href: '/projects/forest-regeneration-banegas-farm-costa-rica',
    hoursAgo: 5,
    icon: '📊',
  },
  {
    id: 'notif-3',
    title: 'Planned Retirement — Braulio Carrillo',
    body: 'A retirement of 1,000 tCO\u2082 from Braulio Carrillo (Costa Rica) has been scheduled for this year.',
    type: 'retirement',
    href: '/projects/forest-regeneration-baum-invest-restoration-project-costa-rica',
    hoursAgo: 8,
    icon: '🔄',
  },
  {
    id: 'notif-4',
    title: 'No Inventory Left — Banegas Farm',
    body: 'All carbon credits from Banegas Farm have now been allocated.',
    type: 'stock',
    href: '/projects/forest-regeneration-banegas-farm-costa-rica',
    hoursAgo: 24,
    icon: '⚠️',
  },
  {
    id: 'notif-5',
    title: 'Allocation — Genzyme \u00d7 Banegas Farm',
    body: '1,576 tCO\u2082 have been allocated to Genzyme from Banegas Farm (Costa Rica).',
    type: 'allocation',
    href: '/dashboard/business-units-allocation',
    hoursAgo: 26,
    icon: '📦',
  },
  {
    id: 'notif-6',
    title: 'Update — Avoidance and Removal Data',
    body: 'The 2025 carbon avoidance and removal data import for all 9 portfolio projects was completed successfully.',
    type: 'update',
    href: '/dashboard',
    hoursAgo: 48,
    icon: '✅',
  },
  {
    id: 'notif-7',
    title: 'Allocation Approved — Medley \u00d7 Bokpyn-Karathuru',
    body: 'The allocation of 15,000 tCO\u2082 from Bokpyn-Karathuru to business unit Medley has been approved.',
    type: 'approval',
    href: '/dashboard/business-units-allocation',
    hoursAgo: 72,
    icon: '✓',
  },
  {
    id: 'notif-8',
    title: 'Project Status — Manjarisoa',
    body: 'Manjarisoa has moved from paused to in progress following a successful audit.',
    type: 'status',
    href: '/projects/forest-regeneration-manjarisoa-madagascar',
    hoursAgo: 96,
    icon: '🔔',
  },
  {
    id: 'notif-9',
    title: 'New Project — HeirZoom',
    body: 'HeirZoom (DAC) has been added to the portfolio.',
    type: 'project',
    href: '/projects/heirzoom-dac-project-iceland',
    hoursAgo: 120,
    icon: '🆕',
  },
];
