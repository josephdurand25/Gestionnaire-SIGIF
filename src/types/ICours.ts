// ==========================================
// TYPES POUR LE SYSTÈME DE GESTION ACADÉMIQUE
// ==========================================

import type { JourSemaine, NiveauEtude, Semestre } from "./api";

// ==========================================
// COURS (Courses)
// ==========================================


export type StatutCours = 'actif' | 'archive' | 'brouillon';

export interface ICours {
  id?: number;
  code: string;                     // Ex: INF101
  nom: string;
  description?: string;
  professeur: string;
  filiere: string;
  credits: number;
  semestre: Semestre;
  capacite_max: number;
  capacite_actuelle?: number;       // Nombre d'inscrits
  jour?: JourSemaine;
  heure_debut?: string;             // Format: HH:MM:SS
  heure_fin?: string;
  salle?: string;
  prerequis?: string;               // Cours prérequis
  niveaux: NiveauEtude;
  statut: StatutCours;
  created_at?: Date;
  updated_at?: Date;
}

export interface ICoursWithEnrollments extends ICours {
  nombre_inscrits: number;
  places_disponibles: number;
  taux_remplissage: number;         // Pourcentage
}

export interface ICoursNiveau {
  id?: number;
  cours_id: number;
  niveau: NiveauEtude;
}
