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
    title: 'Nouveau projet ajouté au portefeuille',
    description: 'Le projet "Forêt Amazonienne BR-07" a été ajouté au portefeuille.',
    type: 'project',
    date: '2026-03-19T10:30:00Z',
    read: false,
    href: '/portfolio',
  },
  {
    id: '2',
    title: 'Changement de statut de projet',
    description: 'Le projet "Mangrove Sénégal" est passé de "En cours" à "Validé".',
    type: 'project',
    date: '2026-03-19T09:15:00Z',
    read: false,
    href: '/projects/mangrove-senegal',
  },
  {
    id: '3',
    title: 'Stock critique — Projet Bornéo',
    description: 'Les crédits carbone disponibles pour "Bornéo Rainforest" sont en dessous du seuil critique (< 500 t CO₂).',
    type: 'critical',
    date: '2026-03-18T17:45:00Z',
    read: false,
    href: '/portfolio/carbon-management',
  },
  {
    id: '4',
    title: 'Échéance de reporting approche',
    description: 'Le rapport trimestriel Q1 2026 est à soumettre dans 5 jours.',
    type: 'deadline',
    date: '2026-03-18T14:00:00Z',
    read: false,
    href: '/dashboard',
  },
  {
    id: '5',
    title: 'Validation demandée',
    description: 'Une revue de l\'allocation Business Unit "Operations" est en attente de votre approbation.',
    type: 'review',
    date: '2026-03-18T11:20:00Z',
    read: false,
    href: '/dashboard/business-units-allocation',
  },
  {
    id: '6',
    title: 'Mise à jour importante terminée',
    description: 'L\'import des données d\'absorption 2025 pour 12 projets est terminé avec succès.',
    type: 'update',
    date: '2026-03-17T16:00:00Z',
    read: true,
    href: '/dashboard',
  },
  {
    id: '7',
    title: 'Stock faible — Projet Kenya',
    description: 'Les crédits carbone du projet "Reforestation Kenya" approchent du seuil d\'alerte (< 2 000 t CO₂).',
    type: 'stock',
    date: '2026-03-17T13:30:00Z',
    read: true,
    href: '/portfolio/carbon-management',
  },
  {
    id: '8',
    title: 'Échéance d\'achat imminente',
    description: 'L\'échéance d\'achat pour le projet "Patagonie Vert" expire dans 3 jours.',
    type: 'deadline',
    date: '2026-03-17T10:00:00Z',
    read: true,
    href: '/portfolio',
  },
  {
    id: '9',
    title: 'Nouvelle fonctionnalité disponible',
    description: 'Le module "Analyse Financière" est maintenant disponible dans votre tableau de bord.',
    type: 'update',
    date: '2026-03-16T09:00:00Z',
    read: true,
    href: '/dashboard',
  },
  {
    id: '10',
    title: 'Revue de projet demandée',
    description: 'L\'équipe Risk demande une revue du projet "Colombie CO2 Reserve" avant validation finale.',
    type: 'review',
    date: '2026-03-15T15:45:00Z',
    read: true,
    href: '/projects/colombie-co2-reserve',
  },
  {
    id: '11',
    title: 'Échéance de retrait approche',
    description: 'Un retrait de 10 000 t CO₂ sur le projet "Gabon Forest" est prévu dans 7 jours.',
    type: 'deadline',
    date: '2026-03-15T12:00:00Z',
    read: true,
    href: '/portfolio/carbon-management',
  },
  {
    id: '12',
    title: 'Projet "Thaïlande Mangrove" ajouté',
    description: 'Un nouveau projet de reforestation en Thaïlande (5 000 ha) a été intégré au portefeuille.',
    type: 'project',
    date: '2026-03-14T08:30:00Z',
    read: true,
    href: '/portfolio',
  },
];
