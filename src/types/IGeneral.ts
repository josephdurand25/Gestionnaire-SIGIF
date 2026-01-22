export type StatutUtilisateur = 'actif' | 'inactif' | 'suspendu';
export type StatutAcademique = 'inscrit' | 'non_inscrit' | 'diplome' | 'abandon' | 'exclu';
export type Genre = 'm' | 'f' | 'autre';
export type RoleUtilisateur = 'ETUDIANT' | 'ENSEIGNANT' | 'ADMINISTRATEUR';
export type TypeEvaluation = 'CONTINUE' | 'EXAMEN' | 'RATTRAPAGE';
export type SessionExamen = 'NORMALE' | 'RATTRAPAGE' | 'SPECIALE';
export type TypeCours = 'CM' | 'TD' | 'TP';
export type TypeUE = 'OBLIGATOIRE' | 'OPTIONNEL' | 'TRANSVERSAL';
export type JourSemaine = 'LUNDI' | 'MARDI' | 'MERCREDI' | 'JEUDI' | 'VENDREDI' | 'SAMEDI';
export type Semestre = 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6' | 'S7' | 'S8' | 'S9' | 'S10';
export type StatutGroupe = 'OUVERT' | 'COMPLET' | 'FERME' | 'ANNULE';
export type TypeSalle = 'AMPHI' | 'TD' | 'TP' | 'LABO' | 'ATELIER';
export const TYPES_SALLE: TypeSalle[] = ['AMPHI', 'TD', 'TP', 'LABO', 'ATELIER'];
export type StatutInscription = 'EN_ATTENTE' | 'VALIDE' | 'REJETE' | 'ANNULE';
export type StatutPaiement = 'IMPAYE' | 'PARTIEL' | 'PAYE';
export type ModePaiement = 'ESPECES' | 'VIREMENT' | 'MOBILE_MONEY' | 'CHEQUE';
export const NIVEAUX = ['L1', 'L2', 'L3', 'M1', 'M2', 'Doctorat'] as const;

// ==========================================
// UI/UX - COMPOSANTS FRONTEND
// ==========================================

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, index: number) => React.ReactNode;
  className?: string;
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T, index: number) => void;
  selectedRows?: Set<string | number>;
  onSelectionChange?: (selected: Set<string | number>) => void;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
}

export interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
  onItemsPerPageChange?: (limit: number) => void;
  showItemsPerPage?: boolean;
  disabled?: boolean;
}