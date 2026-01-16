// ==========================================
// INSCRIPTIONS (Enrollments)
// ==========================================

import type { NiveauEtude, Semestre } from "./api";
/**
 * Année académique au format camerounais
 */
export type AnneeAcademique = `${number}-${number}`; // Ex: "2024-2025"

/**
 * Niveaux LMD camerounais
 */
export type NiveauCameroon = 'L1' | 'L2' | 'L3' | 'M1' | 'M2' | 'Doctorat';

export type StatutInscription = 'inscrit' | 'abandon' | 'termine' | 'en_cours';

/**
 * Types d'unités d'enseignement (UE)
 */
export type TypeUE = 
  | 'UE Fondamentale'           // UE obligatoire
  | 'UE Méthodologique'         // UE de méthodologie
  | 'UE Transversale'           // UE transversale (langues, etc.)
  | 'UE Libre'                  // UE au choix libre
  | 'UE Professionnelle'        // UE professionnalisante
  | 'UE de Projet';             // Projet de fin d'année


/**
 * Groupe de cours (parcours) - Ce à quoi l'étudiant s'inscrit
 */
export interface IGroupeCours {
  id?: number;
  code: string;                    // Ex: "INF-L2-S1-2024"
  nom: string;                     // Ex: "Informatique L2 S1"
  filiere: string;                 // Filière
  niveau: NiveauCameroon;         // Niveau
  semestre: Semestre;             // Semestre
  annee_academique: AnneeAcademique;
  credits_total: number;          // Total crédits du semestre
  ues: IUE[];                     // Unités d'enseignement du groupe
  capacite_max?: number;          // Nombre max d'étudiants dans ce groupe
  responsable_id?: number;        // Responsable pédagogique
  statut: 'actif' | 'inactif' | 'complet';
  created_at?: Date | string;
  updated_at?: Date | string;
}

/**
 * Unité d'Enseignement (UE) - Regroupe plusieurs matières
 */
export interface IUE {
  id?: number;
  code: string;                    // Ex: "UE101"
  nom: string;                     // Ex: "Programmation et Algorithmique"
  type: TypeUE;                   // Type d'UE
  credits: number;                // Crédits ECTS
  coefficient: number;            // Coefficient pour la moyenne
  groupe_cours_id: number;        // Groupe parent
  // matieres: IMatiere[];           // Matières composant l'UE
  volume_horaire_total: number;   // Total heures
  description?: string;
  pre_requis?: string[];          // Codes UE pré-requis
}

export interface IInscription {
  id?: number;
  etudiant_id: number;
  cours_id: number;
  date_inscription: Date;
  statut: StatutInscription;
  semestre: Semestre;
  annee_academique: string;         // Ex: 2024-2025
  created_at?: Date;
  updated_at?: Date;
}

export interface IInscriptionDetails extends IInscription {
  // Infos étudiant
  etudiant_nom: string;
  etudiant_prenom: string;
  etudiant_numero: string;
  etudiant_filiere: string;
  etudiant_niveau: NiveauEtude;
  
  // Infos cours
  cours_nom: string;
  cours_code: string;
  cours_credits: number;
  cours_professeur: string;
}

export interface IEnrollmentRequest {
  etudiant_id: number;
  cours_ids: number[];
  semestre: Semestre;
  annee_academique: string;
}