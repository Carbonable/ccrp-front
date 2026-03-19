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
    title: 'Stock critique — Banegas Farm',
    description: 'Les crédits carbone disponibles pour "Banegas Farm" (Costa Rica) sont en dessous du seuil critique (< 500 tCO\u2082).',
    type: 'critical',
    date: '2026-03-19T10:30:00Z',
    read: false,
    href: '/portfolio/carbon-management',
  },
  {
    id: '2',
    title: 'Nouveau projet ajout\u00e9 — HeirZoom DAC',
    description: 'Le projet "HeirZoom" (Direct Air Capture, Islande) a \u00e9t\u00e9 ajout\u00e9 au portefeuille.',
    type: 'project',
    date: '2026-03-19T09:15:00Z',
    read: false,
    href: '/projects/heirzoom-dac-project-iceland',
  },
  {
    id: '3',
    title: '\u00c9ch\u00e9ance de reporting Q1 2026',
    description: 'Le rapport trimestriel Q1 2026 pour la Business Unit "Genzyme" est \u00e0 soumettre dans 5 jours.',
    type: 'deadline',
    date: '2026-03-18T17:45:00Z',
    read: false,
    href: '/dashboard',
  },
  {
    id: '4',
    title: 'Validation demand\u00e9e — Allocation Medley',
    description: 'Une revue de l\u0027allocation pour la Business Unit "Medley" est en attente de votre approbation.',
    type: 'review',
    date: '2026-03-18T14:00:00Z',
    read: false,
    href: '/dashboard/business-units-allocation',
  },
  {
    id: '5',
    title: 'Manjarisoa — Statut valid\u00e9',
    description: 'Le projet "Manjarisoa" (Madagascar) est pass\u00e9 de "En cours" \u00e0 "Valid\u00e9" apr\u00e8s audit.',
    type: 'project',
    date: '2026-03-18T11:20:00Z',
    read: false,
    href: '/projects/forest-regeneration-manjarisoa-madagascar',
  },
  {
    id: '6',
    title: 'Import absorption 2025 termin\u00e9',
    description: 'L\u0027import des donn\u00e9es d\u0027absorption 2025 pour les 9 projets du portefeuille est termin\u00e9 avec succ\u00e8s.',
    type: 'update',
    date: '2026-03-17T16:00:00Z',
    read: true,
    href: '/dashboard',
  },
  {
    id: '7',
    title: 'Stock faible — Las Delicias',
    description: 'Les cr\u00e9dits carbone du projet "Las Delicias" (Mangroves, Panama) approchent du seuil d\u0027alerte (< 2 000 tCO\u2082).',
    type: 'stock',
    date: '2026-03-17T13:30:00Z',
    read: true,
    href: '/portfolio/carbon-management',
  },
  {
    id: '8',
    title: '\u00c9ch\u00e9ance d\u0027achat — Chaco Agroforestry',
    description: 'L\u0027\u00e9ch\u00e9ance d\u0027achat pour le projet "Chaco Agroforestry" (Paraguay) expire dans 3 jours.',
    type: 'deadline',
    date: '2026-03-17T10:00:00Z',
    read: true,
    href: '/portfolio',
  },
  {
    id: '9',
    title: 'Analyse financi\u00e8re disponible',
    description: 'Le module "Analyse Financi\u00e8re" a \u00e9t\u00e9 mis \u00e0 jour avec les donn\u00e9es Q4 2025 pour toutes les Business Units.',
    type: 'update',
    date: '2026-03-16T09:00:00Z',
    read: true,
    href: '/dashboard',
  },
  {
    id: '10',
    title: 'Revue demand\u00e9e — Bokpyn-Karathuru',
    description: 'L\u0027\u00e9quipe Risk demande une revue du projet "Bokpyn-Karathuru" (Mangroves, Myanmar) avant validation finale.',
    type: 'review',
    date: '2026-03-15T15:45:00Z',
    read: true,
    href: '/projects/mangroves-regeneration-karathuru-myanmar',
  },
  {
    id: '11',
    title: 'Retrait planifi\u00e9 — Braulio Carrillo',
    description: 'Un retrait de 10 000 tCO\u2082 sur le projet "Braulio Carrillo" (Costa Rica) est pr\u00e9vu dans 7 jours.',
    type: 'deadline',
    date: '2026-03-15T12:00:00Z',
    read: true,
    href: '/portfolio/carbon-management',
  },
  {
    id: '12',
    title: 'Bhadia ALSP — Nouveau vintage 2026',
    description: 'Le vintage 2026 pour le projet "Bhadia ALSP" (Solar Panel, Inde) a \u00e9t\u00e9 cr\u00e9\u00e9 avec 15 000 tCO\u2082 de capacit\u00e9.',
    type: 'project',
    date: '2026-03-14T08:30:00Z',
    read: true,
    href: '/projects/solar-panel-India-bhadia-alsp',
  },
];
