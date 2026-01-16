// ==========================================
// NOTES (Grades)
// ==========================================

export type TypeEvaluation = 'examen' | 'cc' | 'tp' | 'projet';
export type SessionExamen = 'normale' | 'rattrapage';

export interface INote {
  id?: number;
  etudiant_id: number;
  cours_id: number;
  note_cc?: number;                 // Contrôle Continu (0-20)
  note_examen?: number;             // Examen (0-20)
  note_tp?: number;                 // Travaux Pratiques (0-20)
  note_finale: number;              // Calculée automatiquement
  type_evaluation: TypeEvaluation;
  validee: boolean;
  validee_par?: number;             // user_id du validateur
  date_validation?: Date;
  session: SessionExamen;
  commentaire?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface INoteDetails extends INote {
  // Infos étudiant
  etudiant_nom: string;
  etudiant_prenom: string;
  etudiant_numero: string;
  
  // Infos cours
  cours_nom: string;
  cours_code: string;
  cours_credits: number;
  
  // Calculs
  admis: boolean;                   // note_finale >= 10
  mention?: string;                 // Passable, AB, B, TB
}

export interface IGradeEntry {
  etudiant_id: number;
  note_cc?: number;
  note_examen?: number;
  note_tp?: number;
  commentaire?: string;
}

export interface IGradeBatch {
  cours_id: number;
  session: SessionExamen;
  notes: IGradeEntry[];
}

// Statistiques des notes
export interface IGradeStatistics {
  cours_id: number;
  moyenne_classe: number;
  note_min: number;
  note_max: number;
  nb_admis: number;
  nb_ajournes: number;
  taux_reussite: number;            // Pourcentage
  repartition_mentions: {
    passable: number;
    assez_bien: number;
    bien: number;
    tres_bien: number;
  };
}

// ============================================
// INSCRIPTIONS CAMEROUNAISES
// ============================================

/**
 * Année académique au format camerounais
 */
export type AnneeAcademique = `${number}-${number}`; // Ex: "2024-2025"

/**
 * Niveaux LMD camerounais
 */
export type NiveauCameroon = 'L1' | 'L2' | 'L3' | 'M1' | 'M2' | 'Doctorat';

/**
 * Semestres
 */
export type Semestre = 'S1' | 'S2';

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
  matieres: IMatiere[];           // Matières composant l'UE
  volume_horaire_total: number;   // Total heures
  description?: string;
  pre_requis?: string[];          // Codes UE pré-requis
}

/**
 * Matière (cours individuel)
 */
export interface IMatiere {
  id?: number;
  code: string;                    // Ex: "INF201"
  nom: string;                    // Ex: "Algorithmique Avancée"
  ue_id: number;                  // UE parente
  professeur_id: number;          // Enseignant responsable
  credits: number;                // Crédits de la matière
  volume_horaire: number;         // Nombre d'heures
  type_cours: 'CM' | 'TD' | 'TP' | 'Projet';
  coefficient: number;            // Coefficient dans l'UE
  salle?: string;
  jour?: string;
  heure_debut?: string;
  heure_fin?: string;
  statut: 'actif' | 'inactif';
}

/**
 * Inscription de l'étudiant à un groupe de cours
 */
export interface IInscriptionGroupe {
  id?: number;
  etudiant_id: number;
  groupe_cours_id: number;
  annee_academique: AnneeAcademique;
  semestre: Semestre;
  
  // Statut de l'inscription
  statut: 
    | 'preinscrit'          // Pré-inscription en ligne
    | 'dossier_complet'     // Dossier physique déposé
    | 'validee'             // Inscription validée par la scolarité
    | 'refusee'             // Inscription refusée
    | 'abandon'             // Étudiant a abandonné
    | 'reinscription';      // Réinscription pour rattrapage
  
  // Informations administratives
  numero_inscription?: string;    // Numéro d'inscription unique
  date_inscription: Date | string;
  date_validation?: Date | string;
  validee_par?: number;          // Agent de la scolarité
  
  // Paiement des droits universitaires
  droits_universitaires: {
    montant_total: number;
    montant_paye: number;
    statut: 'exonere' | 'partiel' | 'complet' | 'impaye';
    dernier_paiement?: Date | string;
  };
  
  // Fiche d'inscription générée
  fiche_inscription_url?: string;
  
  created_at?: Date | string;
  updated_at?: Date | string;
}

/**
 * Détails complets d'une inscription groupe
 */
export interface IInscriptionGroupeDetails extends IInscriptionGroupe {
  // Informations étudiant
  etudiant: {
    nom: string;
    prenom: string;
    numero_etudiant: string;
    filiere: string;
    niveau: string;
    photo?: string;
    email: string;
    telephone: string;
  };
  
  // Informations groupe
  groupe_cours: {
    code: string;
    nom: string;
    filiere: string;
    niveau: string;
    semestre: string;
    credits_total: number;
    responsable: string;
  };
  
  // Détails des UE et matières
  ues: Array<{
    code: string;
    nom: string;
    type: TypeUE;
    credits: number;
    coefficient: number;
    matieres: Array<{
      code: string;
      nom: string;
      professeur: string;
      type_cours: string;
      credits: number;
      salle?: string;
      horaire?: string;
    }>;
  }>;
  
  // Calculs
  credits_inscrits: number;
  volume_horaire_total: number;
}

/**
 * Fiche de notes par UE (Relevé de Notes)
 */
export interface IReleveNotes {
  etudiant_id: number;
  annee_academique: AnneeAcademique;
  semestre: Semestre;
  ues: Array<{
    ue_code: string;
    ue_nom: string;
    ue_type: TypeUE;
    ue_credits: number;
    ue_coefficient: number;
    matieres: Array<{
      matiere_code: string;
      matiere_nom: string;
      note_cc?: number;
      note_examen?: number;
      note_finale?: number;
      credits: number;
      admis: boolean;
    }>;
    moyenne_ue: number;           // Moyenne pondérée de l'UE
    credits_obtenus: number;      // Crédits obtenus (si moyenne >= 10)
    admis_ue: boolean;            // UE validée ?
  }>;
  moyenne_semestre: number;       // Moyenne générale du semestre
  credits_obtenus_total: number;  // Total crédits obtenus
  credits_inscrits_total: number; // Total crédits inscrits
  decision: 'Admis' | 'Ajourné' | 'Redoublement' | 'Passage avec rattrapage';
  mention?: string;
}

/**
 * Bulletin de paiement des droits universitaires
 */
export interface IBulletinPaiement {
  etudiant_id: number;
  annee_academique: AnneeAcademique;
  frais: Array<{
    libelle: string;              // Ex: "Droits académiques", "Frais bibliothèque"
    montant: number;
    echeance?: Date | string;
    statut: 'paye' | 'impaye' | 'exonere';
  }>;
  total_a_payer: number;
  total_paye: number;
  reste_a_payer: number;
  prochain_echeance?: Date | string;
}

/**
 * Demande de réinscription (pour rattrapage ou redoublement)
 */
export interface IDemandeReinscription {
  etudiant_id: number;
  annee_academique: AnneeAcademique;
  type: 'rattrapage' | 'redoublement' | 'changement_filiere';
  motif: string;
  ues_rattrapage?: string[];      // Codes des UE à rattraper
  groupe_cours_demande?: number;  // Nouveau groupe demandé
  statut: 'en_attente' | 'approuvee' | 'refusee';
  date_demande: Date | string;
  traitee_par?: number;
  date_traitement?: Date | string;
  commentaire?: string;
}

/**
 * Statistiques des inscriptions par groupe
 */
export interface IStatistiquesInscriptions {
  annee_academique: AnneeAcademique;
  semestre: Semestre;
  total_etudiants: number;
  total_preinscrits: number;
  total_valides: number;
  
  par_filiere: Array<{
    filiere: string;
    effectif: number;
    taux_remplissage: number;
  }>;
  
  par_niveau: Array<{
    niveau: NiveauCameroon;
    effectif: number;
  }>;
  
  groupes_complets: Array<{
    groupe_code: string;
    capacite_max: number;
    effectif: number;
  }>;
}

/**
 * Emploi du temps étudiant (basé sur son groupe)
 */
export interface IEmploiDuTemps {
  etudiant_id: number;
  annee_academique: AnneeAcademique;
  semestre: Semestre;
  semaine: Array<{
    jour: string;
    seances: Array<{
      matiere_code: string;
      matiere_nom: string;
      type_cours: 'CM' | 'TD' | 'TP';
      professeur: string;
      salle: string;
      heure_debut: string;
      heure_fin: string;
      ue_code: string;
    }>;
  }>;
}

/**
 * Contrôle de présence par matière
 */
export interface IFeuillePresence {
  matiere_id: number;
  date_seance: Date | string;
  type_seance: 'CM' | 'TD' | 'TP';
  etudiants: Array<{
    etudiant_id: number;
    etudiant_nom: string;
    etudiant_prenom: string;
    present: boolean;
    justification?: string;
    signature?: string;
  }>;
  total_presents: number;
  total_inscrits: number;
  taux_presence: number;
}