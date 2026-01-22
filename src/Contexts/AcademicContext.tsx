import React, { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import type {
  IGroupeCours, 
  IUniteEnseignement, 
  IMatiere,
  IFiliere,
  ISalle,
  IGroupeCoursFilters,
  IUniteEnseignementFilters,
  IMatiereFilters,
  IFiliereFilters,
  ISalleFilters
} from '../types/ICours';
import type { IPaginationResult } from '../types/api';
import api from '../ConfigApp/apiConfigCommunication';

// ==========================================
// TYPES DU CONTEXT
// ==========================================

interface IAcademicState {
  // État pour chaque entité
  groupesCours: IGroupeCours[];
  unitesEnseignement: IUniteEnseignement[];
  matieres: IMatiere[];
  filieres: IFiliere[];
  salles: ISalle[];
  
  // Éléments sélectionnés
  selectedGroupeCours: IGroupeCours | null;
  selectedUniteEnseignement: IUniteEnseignement | null;
  selectedMatiere: IMatiere | null;
  selectedFiliere: IFiliere | null;
  selectedSalle: ISalle | null;
  
  // Statistiques et détails
  groupesWithStats: any[];
  ueWithMatieres: any[];
  matiereWithDetails: any[];
  
  // États de l'interface
  processing: boolean;
  success: boolean;
  message: string | null;
  errors: any;
  
  // Paginations
  paginationGroupes: IPaginationResult<IGroupeCours[]>;
  paginationUEs: IPaginationResult<IUniteEnseignement[]>;
  paginationMatieres: IPaginationResult<IMatiere[]>;
  paginationFilieres: IPaginationResult<IFiliere[]>;
  paginationSalles: IPaginationResult<ISalle[]>;
}

type AcademicAction =
  // Actions pour Groupes de Cours
  | { type: 'SET_GROUPES_COURS'; payload: IGroupeCours[] }
  | { type: 'SET_SELECTED_GROUPE_COURS'; payload: IGroupeCours | null }
  | { type: 'SET_GROUPES_WITH_STATS'; payload: any[] }
  | { type: 'SET_PAGINATION_GROUPES'; payload: IPaginationResult<IGroupeCours[]> }
  
  // Actions pour Unités d'Enseignement
  | { type: 'SET_UNITES_ENSEIGNEMENT'; payload: IUniteEnseignement[] }
  | { type: 'SET_SELECTED_UNITE_ENSEIGNEMENT'; payload: IUniteEnseignement | null }
  | { type: 'SET_UE_WITH_MATIERES'; payload: any[] }
  | { type: 'SET_PAGINATION_UES'; payload: IPaginationResult<IUniteEnseignement[]> }
  
  // Actions pour Matières
  | { type: 'SET_MATIERES'; payload: IMatiere[] }
  | { type: 'SET_SELECTED_MATIERE'; payload: IMatiere | null }
  | { type: 'SET_MATIERE_WITH_DETAILS'; payload: any[] }
  | { type: 'SET_PAGINATION_MATIERES'; payload: IPaginationResult<IMatiere[]> }
  
  // Actions pour Filières
  | { type: 'SET_FILIERES'; payload: IFiliere[] }
  | { type: 'SET_SELECTED_FILIERE'; payload: IFiliere | null }
  | { type: 'SET_PAGINATION_FILIERES'; payload: IPaginationResult<IFiliere[]> }
  
  // Actions pour Salles
  | { type: 'SET_SALLES'; payload: ISalle[] }
  | { type: 'SET_SELECTED_SALLE'; payload: ISalle | null }
  | { type: 'SET_PAGINATION_SALLES'; payload: IPaginationResult<ISalle[]> }
  
  // Actions communes
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_SUCCESS'; payload: boolean }
  | { type: 'SET_MESSAGE'; payload: string | null }
  | { type: 'SET_ERRORS'; payload: any }
  | { type: 'RESET_STATE' }
  | { type: 'RESET_SELECTED' };

interface IAcademicContext {
  state: IAcademicState;
  actions: {
    // === GROUPES DE COURS ===
    fetchGroupesCours: (page?: number, limit?: number, filters?: IGroupeCoursFilters) => Promise<void>;
    fetchGroupeCoursByCode: (code: string) => Promise<void>;
    createGroupeCours: (groupe: IGroupeCours) => Promise<void>;
    updateGroupeCours: (code: string, groupe: Partial<IGroupeCours>) => Promise<void>;
    deleteGroupeCours: (code: string) => Promise<void>;
    fetchGroupesWithStats: (page?: number, limit?: number) => Promise<void>;
    fetchEtudiantsInscrits: (code: string) => Promise<any[]>;
    fetchUnitesEnseignementByGroupe: (code: string) => Promise<void>;
    checkCapacity: (code: string) => Promise<any>;
    
    // === UNITÉS D'ENSEIGNEMENT ===
    fetchUnitesEnseignement: (page?: number, limit?: number, filters?: IUniteEnseignementFilters) => Promise<void>;
    fetchUEByCode: (code: string) => Promise<void>;
    createUniteEnseignement: (ue: IUniteEnseignement) => Promise<void>;
    updateUniteEnseignement: (code: string, ue: Partial<IUniteEnseignement>) => Promise<void>;
    deleteUniteEnseignement: (code: string) => Promise<void>;
    fetchUEWithMatieres: (code: string) => Promise<void>;
    fetchMatieresByUE: (ueCode: string) => Promise<void>;
    fetchUEByGroupeCours: (groupeCode: string) => Promise<void>;
    calculateVolumeHoraireUE: (ueCode: string) => Promise<number>;
    
    // === MATIÈRES ===
    fetchMatieres: (page?: number, limit?: number, filters?: IMatiereFilters) => Promise<void>;
    fetchMatiereByCode: (code: string) => Promise<void>;
    createMatiere: (matiere: IMatiere) => Promise<void>;
    updateMatiere: (code: string, matiere: Partial<IMatiere>) => Promise<void>;
    deleteMatiere: (code: string) => Promise<void>;
    fetchMatiereWithDetails: (code: string) => Promise<void>;
    fetchMatieresByEnseignant: (enseignantId: number) => Promise<void>;
    fetchEtudiantsByMatiere: (matiereCode: string) => Promise<any[]>;
    checkConflicts: (etudiantId: number, matiereCode: string) => Promise<any>;
    fetchEmploiDuTemps: (etudiantId: number, groupeCode?: string) => Promise<any[]>;
    
    // === FILIÈRES ===
    fetchFilieres: (page?: number, limit?: number, filters?: IFiliereFilters) => Promise<void>;
    fetchFiliereByCode: (code: string) => Promise<void>;
    createFiliere: (filiere: IFiliere) => Promise<void>;
    updateFiliere: (code: string, filiere: Partial<IFiliere>) => Promise<void>;
    deleteFiliere: (code: string) => Promise<void>;
    
    // === SALLES ===
    fetchSalles: (page?: number, limit?: number, filters?: ISalleFilters) => Promise<void>;
    fetchSalleByCode: (code: string) => Promise<void>;
    createSalle: (salle: ISalle) => Promise<void>;
    updateSalle: (code: string, salle: Partial<ISalle>) => Promise<void>;
    deleteSalle: (code: string) => Promise<void>;
    
    // === UTILITAIRES ===
    setSelectedGroupeCours: (groupe: IGroupeCours | null) => void;
    setSelectedUniteEnseignement: (ue: IUniteEnseignement | null) => void;
    setSelectedMatiere: (matiere: IMatiere | null) => void;
    setSelectedFiliere: (filiere: IFiliere | null) => void;
    setSelectedSalle: (salle: ISalle | null) => void;
    resetSelected: () => void;
    resetState: () => void;
  };
}

// ==========================================
// ÉTAT INITIAL
// ==========================================

const defaultPagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
};

const initialState: IAcademicState = {
  // Collections
  groupesCours: [],
  unitesEnseignement: [],
  matieres: [],
  filieres: [],
  salles: [],
  
  // Sélections
  selectedGroupeCours: null,
  selectedUniteEnseignement: null,
  selectedMatiere: null,
  selectedFiliere: null,
  selectedSalle: null,
  
  // Détails
  groupesWithStats: [],
  ueWithMatieres: [],
  matiereWithDetails: [],
  
  // États
  processing: false,
  success: false,
  message: null,
  errors: null,
  
  // Paginations
  paginationGroupes: { data: [], pagination: defaultPagination },
  paginationUEs: { data: [], pagination: defaultPagination },
  paginationMatieres: { data: [], pagination: defaultPagination },
  paginationFilieres: { data: [], pagination: defaultPagination },
  paginationSalles: { data: [], pagination: defaultPagination }
};

// ==========================================
// REDUCER
// ==========================================

const academicReducer = (state: IAcademicState, action: AcademicAction): IAcademicState => {
  switch (action.type) {
    // Groupes de Cours
    case 'SET_GROUPES_COURS':
      return { ...state, groupesCours: action.payload };
    case 'SET_SELECTED_GROUPE_COURS':
      return { ...state, selectedGroupeCours: action.payload };
    case 'SET_GROUPES_WITH_STATS':
      return { ...state, groupesWithStats: action.payload };
    case 'SET_PAGINATION_GROUPES':
      return { ...state, paginationGroupes: action.payload };
    
    // Unités d'Enseignement
    case 'SET_UNITES_ENSEIGNEMENT':
      return { ...state, unitesEnseignement: action.payload };
    case 'SET_SELECTED_UNITE_ENSEIGNEMENT':
      return { ...state, selectedUniteEnseignement: action.payload };
    case 'SET_UE_WITH_MATIERES':
      return { ...state, ueWithMatieres: action.payload };
    case 'SET_PAGINATION_UES':
      return { ...state, paginationUEs: action.payload };
    
    // Matières
    case 'SET_MATIERES':
      return { ...state, matieres: action.payload };
    case 'SET_SELECTED_MATIERE':
      return { ...state, selectedMatiere: action.payload };
    case 'SET_MATIERE_WITH_DETAILS':
      return { ...state, matiereWithDetails: action.payload };
    case 'SET_PAGINATION_MATIERES':
      return { ...state, paginationMatieres: action.payload };
    
    // Filières
    case 'SET_FILIERES':
      return { ...state, filieres: action.payload };
    case 'SET_SELECTED_FILIERE':
      return { ...state, selectedFiliere: action.payload };
    case 'SET_PAGINATION_FILIERES':
      return { ...state, paginationFilieres: action.payload };
    
    // Salles
    case 'SET_SALLES':
      return { ...state, salles: action.payload };
    case 'SET_SELECTED_SALLE':
      return { ...state, selectedSalle: action.payload };
    case 'SET_PAGINATION_SALLES':
      return { ...state, paginationSalles: action.payload };
    
    // Commun
    case 'SET_PROCESSING':
      return { ...state, processing: action.payload };
    case 'SET_SUCCESS':
      return { ...state, success: action.payload };
    case 'SET_MESSAGE':
      return { ...state, message: action.payload };
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    case 'RESET_STATE':
      return initialState;
    case 'RESET_SELECTED':
      return {
        ...state,
        selectedGroupeCours: null,
        selectedUniteEnseignement: null,
        selectedMatiere: null,
        selectedFiliere: null,
        selectedSalle: null
      };
    
    default:
      return state;
  }
};

// ==========================================
// CONTEXT
// ==========================================

const AcademicContext = createContext<IAcademicContext | undefined>(undefined);

// ==========================================
// PROVIDER
// ==========================================

export const AcademicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(academicReducer, initialState);

  // ==========================================
  // GESTION DES ERREURS
  // ==========================================

  const handleApiError = useCallback((error: any, defaultMessage: string = 'Une erreur est survenue') => {
    console.error('API Error:', error);

    if (error.response) {
      const { status, data } = error.response;

      dispatch({ type: 'SET_SUCCESS', payload: false });

      if (status === 400) {
        dispatch({ type: 'SET_ERRORS', payload: data.errors || {} });
        dispatch({ type: 'SET_MESSAGE', payload: data.message || 'Données invalides' });
      } else if (status === 404) {
        dispatch({ type: 'SET_MESSAGE', payload: data.message || 'Ressource non trouvée' });
      } else if (status === 409) {
        dispatch({ type: 'SET_MESSAGE', payload: data.message || 'Conflit: cette ressource existe déjà' });
      } else if (status === 422) {
        dispatch({ type: 'SET_ERRORS', payload: data.errors || {} });
        dispatch({ type: 'SET_MESSAGE', payload: data.message || 'Erreur de validation' });
      } else if (status === 500) {
        dispatch({ type: 'SET_MESSAGE', payload: 'Erreur serveur. Veuillez réessayer.' });
      } else {
        dispatch({ type: 'SET_MESSAGE', payload: data.message || defaultMessage });
      }
    } else if (error.request) {
      dispatch({ type: 'SET_MESSAGE', payload: 'Pas de réponse du serveur' });
      dispatch({ type: 'SET_SUCCESS', payload: false });
    } else {
      dispatch({ type: 'SET_MESSAGE', payload: error.message || defaultMessage });
      dispatch({ type: 'SET_SUCCESS', payload: false });
    }
  }, []);

  // ==========================================
  // ACTIONS - GROUPES DE COURS
  // ==========================================

  const fetchGroupesCours = useCallback(async (
    page: number = 1,
    limit: number = 10,
    filters?: IGroupeCoursFilters
  ) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters?.filiere_code && { filiere_code: filters.filiere_code }),
        ...(filters?.niveau && { niveau: filters.niveau }),
        ...(filters?.semestre && { semestre: filters.semestre }),
        ...(filters?.annee_academique_code && { annee_academique_code: filters.annee_academique_code }),
        ...(filters?.statut && { statut: filters.statut }),
        ...(filters?.search && { search: filters.search })
      });

      const response = await api.get<IPaginationResult<IGroupeCours[]>>(`/api/groupes-cours?${params}`);
      
      dispatch({ type: 'SET_GROUPES_COURS', payload: response.data.data });
      dispatch({ type: 'SET_PAGINATION_GROUPES', payload: response.data });
      dispatch({ type: 'SET_SUCCESS', payload: true });
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la récupération des groupes de cours');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [handleApiError]);

  const fetchGroupeCoursByCode = useCallback(async (code: string) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const response = await api.get<IGroupeCours>(`/api/groupes-cours/${code}`);
      dispatch({ type: 'SET_SELECTED_GROUPE_COURS', payload: response.data });
      dispatch({ type: 'SET_SUCCESS', payload: true });
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la récupération du groupe de cours');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [handleApiError]);

  const createGroupeCours = useCallback(async (groupe: IGroupeCours) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const response = await api.post<IGroupeCours>('/api/groupes-cours', groupe);
      
      dispatch({ type: 'SET_SUCCESS', payload: true });
      dispatch({ type: 'SET_MESSAGE', payload: 'Groupe de cours créé avec succès' });
      
      // Rafraîchir la liste
      await fetchGroupesCours(state.paginationGroupes.pagination.page, state.paginationGroupes.pagination.limit);
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la création du groupe de cours');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [state.paginationGroupes, fetchGroupesCours, handleApiError]);

  const updateGroupeCours = useCallback(async (code: string, groupe: Partial<IGroupeCours>) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const response = await api.put<IGroupeCours>(`/api/groupes-cours/${code}`, groupe);
      
      dispatch({ type: 'SET_SELECTED_GROUPE_COURS', payload: response.data });
      dispatch({ type: 'SET_SUCCESS', payload: true });
      dispatch({ type: 'SET_MESSAGE', payload: 'Groupe de cours mis à jour avec succès' });
      
      // Rafraîchir la liste
      await fetchGroupesCours(state.paginationGroupes.pagination.page, state.paginationGroupes.pagination.limit);
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la mise à jour du groupe de cours');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [state.paginationGroupes, fetchGroupesCours, handleApiError]);

  const deleteGroupeCours = useCallback(async (code: string) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      await api.delete(`/api/groupes-cours/${code}`);
      
      dispatch({ type: 'SET_SUCCESS', payload: true });
      dispatch({ type: 'SET_MESSAGE', payload: 'Groupe de cours supprimé avec succès' });
      
      // Rafraîchir la liste
      await fetchGroupesCours(state.paginationGroupes.pagination.page, state.paginationGroupes.pagination.limit);
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la suppression du groupe de cours');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [state.paginationGroupes, fetchGroupesCours, handleApiError]);

  const fetchGroupesWithStats = useCallback(async (page: number = 1, limit: number = 10) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      const response = await api.get<any[]>(`/api/groupes-cours/stats?${params}`);
      dispatch({ type: 'SET_GROUPES_WITH_STATS', payload: response.data });
      dispatch({ type: 'SET_SUCCESS', payload: true });
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la récupération des statistiques');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [handleApiError]);

  const fetchEtudiantsInscrits = useCallback(async (code: string): Promise<any[]> => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const response = await api.get<any[]>(`/api/groupes-cours/${code}/etudiants`);
      dispatch({ type: 'SET_SUCCESS', payload: true });
      return response.data;
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la récupération des étudiants');
      return [];
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [handleApiError]);

  const fetchUnitesEnseignementByGroupe = useCallback(async (code: string) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const response = await api.get<IUniteEnseignement[]>(`/api/groupes-cours/${code}/ues`);
      dispatch({ type: 'SET_UNITES_ENSEIGNEMENT', payload: response.data });
      dispatch({ type: 'SET_SUCCESS', payload: true });
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la récupération des UE');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [handleApiError]);

  const checkCapacity = useCallback(async (code: string): Promise<any> => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const response = await api.get<any>(`/api/groupes-cours/${code}/capacity`);
      dispatch({ type: 'SET_SUCCESS', payload: true });
      return response.data;
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la vérification de la capacité');
      return null;
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [handleApiError]);

  // ==========================================
  // ACTIONS - UNITÉS D'ENSEIGNEMENT
  // ==========================================

  const fetchUnitesEnseignement = useCallback(async (
    page: number = 1,
    limit: number = 10,
    filters?: IUniteEnseignementFilters
  ) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters?.groupe_cours_code && { groupe_cours_code: filters.groupe_cours_code }),
        ...(filters?.type && { type: filters.type }),
        ...(filters?.search && { search: filters.search })
      });

      const response = await api.get<IPaginationResult<IUniteEnseignement[]>>(`/api/unites-enseignement?${params}`);
      
      dispatch({ type: 'SET_UNITES_ENSEIGNEMENT', payload: response.data.data });
      dispatch({ type: 'SET_PAGINATION_UES', payload: response.data });
      dispatch({ type: 'SET_SUCCESS', payload: true });
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la récupération des UE');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [handleApiError]);

  const fetchUEByCode = useCallback(async (code: string) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const response = await api.get<IUniteEnseignement>(`/api/unites-enseignement/${code}`);
      dispatch({ type: 'SET_SELECTED_UNITE_ENSEIGNEMENT', payload: response.data });
      dispatch({ type: 'SET_SUCCESS', payload: true });
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la récupération de l\'UE');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [handleApiError]);

  const createUniteEnseignement = useCallback(async (ue: IUniteEnseignement) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const response = await api.post<IUniteEnseignement>('/api/unites-enseignement', ue);
      
      dispatch({ type: 'SET_SUCCESS', payload: true });
      dispatch({ type: 'SET_MESSAGE', payload: 'UE créée avec succès' });
      
      await fetchUnitesEnseignement(state.paginationUEs.pagination.page, state.paginationUEs.pagination.limit);
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la création de l\'UE');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [state.paginationUEs, fetchUnitesEnseignement, handleApiError]);

  const updateUniteEnseignement = useCallback(async (code: string, ue: Partial<IUniteEnseignement>) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const response = await api.put<IUniteEnseignement>(`/api/unites-enseignement/${code}`, ue);
      
      dispatch({ type: 'SET_SELECTED_UNITE_ENSEIGNEMENT', payload: response.data });
      dispatch({ type: 'SET_SUCCESS', payload: true });
      dispatch({ type: 'SET_MESSAGE', payload: 'UE mise à jour avec succès' });
      
      await fetchUnitesEnseignement(state.paginationUEs.pagination.page, state.paginationUEs.pagination.limit);
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la mise à jour de l\'UE');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [state.paginationUEs, fetchUnitesEnseignement, handleApiError]);

  const deleteUniteEnseignement = useCallback(async (code: string) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      await api.delete(`/api/unites-enseignement/${code}`);
      
      dispatch({ type: 'SET_SUCCESS', payload: true });
      dispatch({ type: 'SET_MESSAGE', payload: 'UE supprimée avec succès' });
      
      await fetchUnitesEnseignement(state.paginationUEs.pagination.page, state.paginationUEs.pagination.limit);
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la suppression de l\'UE');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [state.paginationUEs, fetchUnitesEnseignement, handleApiError]);

  const fetchUEWithMatieres = useCallback(async (code: string) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const response = await api.get<any>(`/api/unites-enseignement/${code}/matieres`);
      dispatch({ type: 'SET_UE_WITH_MATIERES', payload: response.data });
      dispatch({ type: 'SET_SUCCESS', payload: true });
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la récupération des matières de l\'UE');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [handleApiError]);

  const fetchMatieresByUE = useCallback(async (ueCode: string) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const response = await api.get<IMatiere[]>(`/api/unites-enseignement/${ueCode}/matieres`);
      dispatch({ type: 'SET_MATIERES', payload: response.data });
      dispatch({ type: 'SET_SUCCESS', payload: true });
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la récupération des matières');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [handleApiError]);

  const fetchUEByGroupeCours = useCallback(async (groupeCode: string) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const response = await api.get<IUniteEnseignement[]>(`/api/groupes-cours/${groupeCode}/ues`);
      dispatch({ type: 'SET_UNITES_ENSEIGNEMENT', payload: response.data });
      dispatch({ type: 'SET_SUCCESS', payload: true });
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la récupération des UE');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [handleApiError]);

  const calculateVolumeHoraireUE = useCallback(async (ueCode: string): Promise<number> => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const response = await api.get<{ volume_horaire_total: number }>(`/api/unites-enseignement/${ueCode}/volume-horaire`);
      dispatch({ type: 'SET_SUCCESS', payload: true });
      return response.data.volume_horaire_total;
    } catch (error: any) {
      handleApiError(error, 'Erreur lors du calcul du volume horaire');
      return 0;
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [handleApiError]);

  // ==========================================
  // ACTIONS - MATIÈRES
  // ==========================================

  const fetchMatieres = useCallback(async (
    page: number = 1,
    limit: number = 10,
    filters?: IMatiereFilters
  ) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters?.unite_enseignement_code && { unite_enseignement_code: filters.unite_enseignement_code }),
        ...(filters?.type_cours && { type_cours: filters.type_cours }),
        ...(filters?.enseignant_id && { enseignant_id: filters.enseignant_id.toString() }),
        ...(filters?.jour && { jour: filters.jour }),
        ...(filters?.search && { search: filters.search })
      });

      const response = await api.get<IPaginationResult<IMatiere[]>>(`/api/matieres?${params}`);
      
      dispatch({ type: 'SET_MATIERES', payload: response.data.data });
      dispatch({ type: 'SET_PAGINATION_MATIERES', payload: response.data });
      dispatch({ type: 'SET_SUCCESS', payload: true });
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la récupération des matières');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [handleApiError]);

  const fetchMatiereByCode = useCallback(async (code: string) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const response = await api.get<IMatiere>(`/api/matieres/${code}`);
      dispatch({ type: 'SET_SELECTED_MATIERE', payload: response.data });
      dispatch({ type: 'SET_SUCCESS', payload: true });
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la récupération de la matière');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [handleApiError]);

  const createMatiere = useCallback(async (matiere: IMatiere) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const response = await api.post<IMatiere>('/api/matieres', matiere);
      
      dispatch({ type: 'SET_SUCCESS', payload: true });
      dispatch({ type: 'SET_MESSAGE', payload: 'Matière créée avec succès' });
      
      await fetchMatieres(state.paginationMatieres.pagination.page, state.paginationMatieres.pagination.limit);
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la création de la matière');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [state.paginationMatieres, fetchMatieres, handleApiError]);

  const updateMatiere = useCallback(async (code: string, matiere: Partial<IMatiere>) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const response = await api.put<IMatiere>(`/api/matieres/${code}`, matiere);
      
      dispatch({ type: 'SET_SELECTED_MATIERE', payload: response.data });
      dispatch({ type: 'SET_SUCCESS', payload: true });
      dispatch({ type: 'SET_MESSAGE', payload: 'Matière mise à jour avec succès' });
      
      await fetchMatieres(state.paginationMatieres.pagination.page, state.paginationMatieres.pagination.limit);
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la mise à jour de la matière');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [state.paginationMatieres, fetchMatieres, handleApiError]);

  const deleteMatiere = useCallback(async (code: string) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      await api.delete(`/api/matieres/${code}`);
      
      dispatch({ type: 'SET_SUCCESS', payload: true });
      dispatch({ type: 'SET_MESSAGE', payload: 'Matière supprimée avec succès' });
      
      await fetchMatieres(state.paginationMatieres.pagination.page, state.paginationMatieres.pagination.limit);
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la suppression de la matière');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [state.paginationMatieres, fetchMatieres, handleApiError]);

  const fetchMatiereWithDetails = useCallback(async (code: string) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const response = await api.get<any>(`/api/matieres/${code}/details`);
      dispatch({ type: 'SET_MATIERE_WITH_DETAILS', payload: response.data });
      dispatch({ type: 'SET_SUCCESS', payload: true });
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la récupération des détails');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [handleApiError]);

  const fetchMatieresByEnseignant = useCallback(async (enseignantId: number) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const response = await api.get<IMatiere[]>(`/api/enseignants/${enseignantId}/matieres`);
      dispatch({ type: 'SET_MATIERES', payload: response.data });
      dispatch({ type: 'SET_SUCCESS', payload: true });
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la récupération des matières');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [handleApiError]);

  const fetchEtudiantsByMatiere = useCallback(async (matiereCode: string): Promise<any[]> => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const response = await api.get<any[]>(`/api/matieres/${matiereCode}/etudiants`);
      dispatch({ type: 'SET_SUCCESS', payload: true });
      return response.data;
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la récupération des étudiants');
      return [];
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [handleApiError]);

  const checkConflicts = useCallback(async (etudiantId: number, matiereCode: string): Promise<any> => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const response = await api.post<any>('/api/matieres/check-conflicts', {
        etudiant_id: etudiantId,
        matiere_code: matiereCode
      });
      dispatch({ type: 'SET_SUCCESS', payload: true });
      return response.data;
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la vérification des conflits');
      return null;
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [handleApiError]);

  const fetchEmploiDuTemps = useCallback(async (etudiantId: number, groupeCode?: string): Promise<any[]> => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const params = new URLSearchParams();
      if (groupeCode) params.append('groupeCode', groupeCode);
      
      const response = await api.get<any[]>(`/api/etudiants/${etudiantId}/emploi-du-temps?${params}`);
      dispatch({ type: 'SET_SUCCESS', payload: true });
      return response.data;
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la récupération de l\'emploi du temps');
      return [];
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [handleApiError]);

  // ==========================================
  // ACTIONS - FILIÈRES
  // ==========================================

  const fetchFilieres = useCallback(async (
    page: number = 1,
    limit: number = 10,
    filters?: IFiliereFilters
  ) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters?.departement && { departement: filters.departement }),
        ...(filters?.responsable_id && { responsable_id: filters.responsable_id.toString() }),
        ...(filters?.search && { search: filters.search })
      });

      const response = await api.get<IPaginationResult<IFiliere[]>>(`/api/filieres?${params}`);
      
      dispatch({ type: 'SET_FILIERES', payload: response.data.data });
      dispatch({ type: 'SET_PAGINATION_FILIERES', payload: response.data });
      dispatch({ type: 'SET_SUCCESS', payload: true });
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la récupération des filières');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [handleApiError]);

  const fetchFiliereByCode = useCallback(async (code: string) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const response = await api.get<IFiliere>(`/api/filieres/${code}`);
      dispatch({ type: 'SET_SELECTED_FILIERE', payload: response.data });
      dispatch({ type: 'SET_SUCCESS', payload: true });
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la récupération de la filière');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [handleApiError]);

  const createFiliere = useCallback(async (filiere: IFiliere) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const response = await api.post<IFiliere>('/api/filieres', filiere);
      
      dispatch({ type: 'SET_SUCCESS', payload: true });
      dispatch({ type: 'SET_MESSAGE', payload: 'Filière créée avec succès' });
      
      await fetchFilieres(state.paginationFilieres.pagination.page, state.paginationFilieres.pagination.limit);
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la création de la filière');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [state.paginationFilieres, fetchFilieres, handleApiError]);

  const updateFiliere = useCallback(async (code: string, filiere: Partial<IFiliere>) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const response = await api.put<IFiliere>(`/api/filieres/${code}`, filiere);
      
      dispatch({ type: 'SET_SELECTED_FILIERE', payload: response.data });
      dispatch({ type: 'SET_SUCCESS', payload: true });
      dispatch({ type: 'SET_MESSAGE', payload: 'Filière mise à jour avec succès' });
      
      await fetchFilieres(state.paginationFilieres.pagination.page, state.paginationFilieres.pagination.limit);
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la mise à jour de la filière');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [state.paginationFilieres, fetchFilieres, handleApiError]);

  const deleteFiliere = useCallback(async (code: string) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      await api.delete(`/api/filieres/${code}`);
      
      dispatch({ type: 'SET_SUCCESS', payload: true });
      dispatch({ type: 'SET_MESSAGE', payload: 'Filière supprimée avec succès' });
      
      await fetchFilieres(state.paginationFilieres.pagination.page, state.paginationFilieres.pagination.limit);
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la suppression de la filière');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [state.paginationFilieres, fetchFilieres, handleApiError]);

  // ==========================================
  // ACTIONS - SALLES
  // ==========================================

  const fetchSalles = useCallback(async (
    page: number = 1,
    limit: number = 10,
    filters?: ISalleFilters
  ) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters?.type && { type: filters.type }),
        ...(filters?.capacite_min && { capacite_min: filters.capacite_min.toString() }),
        ...(filters?.capacite_max && { capacite_max: filters.capacite_max.toString() }),
        ...(filters?.search && { search: filters.search })
      });

      const response = await api.get<IPaginationResult<ISalle[]>>(`/api/salles?${params}`);
      
      dispatch({ type: 'SET_SALLES', payload: response.data.data });
      dispatch({ type: 'SET_PAGINATION_SALLES', payload: response.data });
      dispatch({ type: 'SET_SUCCESS', payload: true });
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la récupération des salles');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [handleApiError]);

  const fetchSalleByCode = useCallback(async (code: string) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const response = await api.get<ISalle>(`/api/salles/${code}`);
      dispatch({ type: 'SET_SELECTED_SALLE', payload: response.data });
      dispatch({ type: 'SET_SUCCESS', payload: true });
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la récupération de la salle');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [handleApiError]);

  const createSalle = useCallback(async (salle: ISalle) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const response = await api.post<ISalle>('/api/salles', salle);
      
      dispatch({ type: 'SET_SUCCESS', payload: true });
      dispatch({ type: 'SET_MESSAGE', payload: 'Salle créée avec succès' });
      
      await fetchSalles(state.paginationSalles.pagination.page, state.paginationSalles.pagination.limit);
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la création de la salle');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [state.paginationSalles, fetchSalles, handleApiError]);

  const updateSalle = useCallback(async (code: string, salle: Partial<ISalle>) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      const response = await api.put<ISalle>(`/api/salles/${code}`, salle);
      
      dispatch({ type: 'SET_SELECTED_SALLE', payload: response.data });
      dispatch({ type: 'SET_SUCCESS', payload: true });
      dispatch({ type: 'SET_MESSAGE', payload: 'Salle mise à jour avec succès' });
      
      await fetchSalles(state.paginationSalles.pagination.page, state.paginationSalles.pagination.limit);
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la mise à jour de la salle');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [state.paginationSalles, fetchSalles, handleApiError]);

  const deleteSalle = useCallback(async (code: string) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERRORS', payload: null });

    try {
      await api.delete(`/api/salles/${code}`);
      
      dispatch({ type: 'SET_SUCCESS', payload: true });
      dispatch({ type: 'SET_MESSAGE', payload: 'Salle supprimée avec succès' });
      
      await fetchSalles(state.paginationSalles.pagination.page, state.paginationSalles.pagination.limit);
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la suppression de la salle');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [state.paginationSalles, fetchSalles, handleApiError]);

  // ==========================================
  // ACTIONS UTILITAIRES
  // ==========================================

  const setSelectedGroupeCours = useCallback((groupe: IGroupeCours | null) => {
    dispatch({ type: 'SET_SELECTED_GROUPE_COURS', payload: groupe });
  }, []);

  const setSelectedUniteEnseignement = useCallback((ue: IUniteEnseignement | null) => {
    dispatch({ type: 'SET_SELECTED_UNITE_ENSEIGNEMENT', payload: ue });
  }, []);

  const setSelectedMatiere = useCallback((matiere: IMatiere | null) => {
    dispatch({ type: 'SET_SELECTED_MATIERE', payload: matiere });
  }, []);

  const setSelectedFiliere = useCallback((filiere: IFiliere | null) => {
    dispatch({ type: 'SET_SELECTED_FILIERE', payload: filiere });
  }, []);

  const setSelectedSalle = useCallback((salle: ISalle | null) => {
    dispatch({ type: 'SET_SELECTED_SALLE', payload: salle });
  }, []);

  const resetSelected = useCallback(() => {
    dispatch({ type: 'RESET_SELECTED' });
  }, []);

  const resetState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);

  // ==========================================
  // VALEUR DU CONTEXT
  // ==========================================

  const value: IAcademicContext = {
    state,
    actions: {
      // Groupes de Cours
      fetchGroupesCours,
      fetchGroupeCoursByCode,
      createGroupeCours,
      updateGroupeCours,
      deleteGroupeCours,
      fetchGroupesWithStats,
      fetchEtudiantsInscrits,
      fetchUnitesEnseignementByGroupe,
      checkCapacity,
      
      // Unités d'Enseignement
      fetchUnitesEnseignement,
      fetchUEByCode,
      createUniteEnseignement,
      updateUniteEnseignement,
      deleteUniteEnseignement,
      fetchUEWithMatieres,
      fetchMatieresByUE,
      fetchUEByGroupeCours,
      calculateVolumeHoraireUE,
      
      // Matières
      fetchMatieres,
      fetchMatiereByCode,
      createMatiere,
      updateMatiere,
      deleteMatiere,
      fetchMatiereWithDetails,
      fetchMatieresByEnseignant,
      fetchEtudiantsByMatiere,
      checkConflicts,
      fetchEmploiDuTemps,
      
      // Filières
      fetchFilieres,
      fetchFiliereByCode,
      createFiliere,
      updateFiliere,
      deleteFiliere,
      
      // Salles
      fetchSalles,
      fetchSalleByCode,
      createSalle,
      updateSalle,
      deleteSalle,
      
      // Utilitaires
      setSelectedGroupeCours,
      setSelectedUniteEnseignement,
      setSelectedMatiere,
      setSelectedFiliere,
      setSelectedSalle,
      resetSelected,
      resetState
    }
  };

  return (
    <AcademicContext.Provider value={value}>
      {children}
    </AcademicContext.Provider>
  );
};

// ==========================================
// HOOK
// ==========================================

export const useAcademic = (): IAcademicContext => {
  const context = useContext(AcademicContext);
  
  if (!context) {
    throw new Error('useAcademic doit être utilisé dans un AcademicProvider');
  }
  
  return context;
};

export default AcademicContext;