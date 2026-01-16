import React, { createContext, useCallback, useContext, useReducer, useMemo, type ReactNode } from "react";
import { handleApiError } from "../ConfigApp/errorHandle";
import api from "../ConfigApp/apiConfigCommunication";
import type { IEtudiant, IEtudiantFormRequest, IEtudiantUpdaterequest, StatutEtudiant, IEtudiantFilters, IPagination } from "../../server/src/types/Istudents";
import type { ICours } from "../../server/src/types/ICours";
import type { INote } from "../../server/src/types/INote";
import { useNavigate } from "react-router";
import { useToast } from "./TaostContainer";
import type { ApiResponseOk } from "../types/api";

// ─────────────────────────── Types ─────────────────────────────

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface ModalStates {
  studentDetails: boolean;
  studentForm: boolean;
  studentDelete: boolean;
  studentNotes: boolean;
  studentCourses: boolean;
}

export interface StatsData {
  total: number;
  actifs: number;
  inactifs: number;
  diplomes: number;
  parFiliere: Array<{
    filiere: string;
    total: number;
    actifs: number;
    diplomes: number;
    abandons: number;
    age_moyen: number;
  }>;
}

// ─────────────────────────── State ─────────────────────────────

export interface StudentState {
  // Données principales
  students: IEtudiant[] | [];
  selectedStudent: IEtudiant | null;
  
  // Filtres et recherche
  filters: IEtudiantFilters;
  searchTerm: string;
  
  // État des opérations
  processing: boolean;
  success: boolean;
  message: string | undefined;
  errors: Record<string, string>;
  errorType: string | null;
  cause: string | undefined;
  
  // Pagination et tri
  pagination: PaginationState;
  sortConfig: SortConfig;
  
  // États des modals
  modals: ModalStates;
  
  // Statistiques
  stats: StatsData | null;
  
  // Données associées
  studentCourses: any[];
  studentNotes: any[];
  studentMoyenne: any;
}

// ─────────────────────────── Actions ─────────────────────────────

export type StudentAction =
  | { type: "FETCH_STUDENTS_SUCCESS"; payload: {students: IEtudiant[], pagination: PaginationState} }
  // | { type: "FETCH_STUDENTS_SUCCESS"; payload: IPaginationResult<IEtudiant> }
  | { type: "SET_SELECTED_STUDENT"; payload: IEtudiant | null }
  | { type: "SET_FILTERS"; payload: IEtudiantFilters }
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "RESET_FILTERS" }
  | { type: "SET_PROCESSING"; payload: boolean }
  | { type: "SET_SUCCESS"; payload: boolean }
  | { type: "SET_MESSAGE"; payload: string | undefined }
  | { type: "SET_ERRORS"; payload: Record<string, string> }
  | { type: "SET_ERROR_TYPE"; payload: string | null }
  | { type: "SET_CAUSE"; payload: string | undefined }
  | { type: "RESET_ERRORS" }
  | { type: "SET_PAGINATION"; payload: Partial<PaginationState> }
  | { type: "SET_SORT_CONFIG"; payload: SortConfig }
  | { type: "TOGGLE_MODAL"; payload: { modal: keyof ModalStates; isOpen: boolean } }
  | { type: "SET_STATS"; payload: StatsData }
  | { type: "SET_STUDENT_COURSES"; payload: any[] }
  | { type: "SET_STUDENT_NOTES"; payload: any[] }
  | { type: "SET_STUDENT_MOYENNE"; payload: any }
  | { type: "ADD_STUDENT"; payload: IEtudiant }
  | { type: "UPDATE_STUDENT"; payload: IEtudiant }
  | { type: "DELETE_STUDENT"; payload: number };

// ─────────────────────────── Initial State ─────────────────────────────

export const initialStudentState: StudentState = {
  students: [],
  selectedStudent: null,
  filters: {},
  searchTerm: "",
  processing: false,
  success: false,
  message: undefined,
  errors: {},
  errorType: null,
  cause: undefined,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  },
  sortConfig: {
    field: 'nom',
    direction: 'asc'
  },
  modals: {
    studentDetails: false,
    studentForm: false,
    studentDelete: false,
    studentNotes: false,
    studentCourses: false
  },
  stats: null,
  studentCourses: [],
  studentNotes: [],
  studentMoyenne: null
};

// ─────────────────────────── Reducer ─────────────────────────────

function studentReducer(state: StudentState, action: StudentAction): StudentState {
  switch (action.type) {
    case "FETCH_STUDENTS_SUCCESS":
      return {
        ...state,
        students: action.payload.students,
        pagination: {
           page: action.payload?.pagination?.page ?? 1,
            limit: action.payload?.pagination?.limit ?? 10,
            total: action.payload?.pagination?.total ?? 0,
            totalPages: action.payload?.pagination?.totalPages ?? 0
        }
      };

    case "SET_SELECTED_STUDENT":
      return { ...state, selectedStudent: action.payload };

    case "SET_FILTERS":
      return { ...state, filters: action.payload };

    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };

    case "RESET_FILTERS":
      return { ...state, filters: {}, searchTerm: "" };

    case "SET_PROCESSING":
      return { ...state, processing: action.payload };

    case "SET_SUCCESS":
      return { ...state, success: action.payload };

    case "SET_MESSAGE":
      return { ...state, message: action.payload };

    case "SET_ERRORS":
      return { ...state, errors: action.payload };

    case "SET_ERROR_TYPE":
      return { ...state, errorType: action.payload };

    case "SET_CAUSE":
      return { ...state, cause: action.payload };

    case "RESET_ERRORS":
      return {
        ...state,
        errors: {},
        errorType: null,
        cause: undefined,
        message: undefined
      };

    case "SET_PAGINATION":
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload }
      };

    case "SET_SORT_CONFIG":
      return { ...state, sortConfig: action.payload };

    case "TOGGLE_MODAL":
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload.modal]: action.payload.isOpen
        }
      };

    case "SET_STATS":
      return { ...state, stats: action.payload };

    case "SET_STUDENT_COURSES":
      return { ...state, studentCourses: action.payload };

    case "SET_STUDENT_NOTES":
      return { ...state, studentNotes: action.payload };

    case "SET_STUDENT_MOYENNE":
      return { ...state, studentMoyenne: action.payload };

    case "ADD_STUDENT":
      return {
        ...state,
        students: [...state.students, action.payload],
        pagination: {
          ...state.pagination,
          total: state.pagination.total + 1
        }
      };

    case "UPDATE_STUDENT":
      // Vérifier que action.payload existe et a un id
      if (!action.payload || typeof action.payload !== 'object' || !('id' in action.payload)) {
        console.error('UPDATE_STUDENT action payload invalide:', action.payload);
        return state; // Retourner l'état inchangé
      }
      return {
        ...state,
        students: state.students.map(s =>
          s.id === action.payload.id ? action.payload : s
        ),
        selectedStudent: state.selectedStudent?.id === action.payload.id
          ? action.payload
          : state.selectedStudent
      };

    case "DELETE_STUDENT":
      return {
        ...state,
        students: state.students.filter(s => s.id !== action.payload),
        selectedStudent: state.selectedStudent?.id === action.payload
          ? null
          : state.selectedStudent,
        pagination: {
          ...state.pagination,
          total: state.pagination.total - 1
        }
      };

    default:
      return state;
  }
}

// ─────────────────────────── Context ─────────────────────────────

interface StudentContextType {
  state: StudentState;
  actions: {
    fetchStudents: (page?: number, limit?: number) => Promise<void>;
    fetchStudentById: (id: number) => Promise<void>;
    createStudent: (data: IEtudiantFormRequest) => Promise<void>;
    updateStudent: (id: number, data: IEtudiantUpdaterequest) => Promise<void>;
    deleteStudent: (id: number) => Promise<void>;
    toggleStudentStatus: (id: number, statut?: StatutEtudiant) => Promise<void>;
    fetchStudentCourses: (id: number) => Promise<void>;
    fetchStudentNotes: (id: number) => Promise<void>;
    fetchStudentMoyenne: (id: number) => Promise<void>;
    fetchStats: () => Promise<void>;
    searchStudents: (criteria: any) => Promise<void>;
    setSelectedStudent: (student: IEtudiant | null) => void;
    setFilters: (filters: IEtudiantFilters) => void;
    setSearchTerm: (term: string) => void;
    applyFilters: () => Promise<void>;
    resetFilters: () => void;
    resetErrors: () => void;
    setPagination: (pagination: Partial<PaginationState>) => void;
    setSortConfig: (config: SortConfig) => void;
    toggleModal: (modal: keyof ModalStates, isOpen: boolean) => void;
  };
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

// ─────────────────────────── Provider ─────────────────────────────

interface StudentProviderProps {
  children: ReactNode;
}

export const StudentProvider: React.FC<StudentProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(studentReducer, initialStudentState);
  const navigate = useNavigate();
  const { addToast }= useToast()

  // ═══════════════════════ CRUD Operations ═══════════════════════

  const fetchStudents = useCallback(async (page?: number, limit?: number) => {
    dispatch({ type: "SET_PROCESSING", payload: true });
    dispatch({ type: "RESET_ERRORS" });

    try {
      const params = new URLSearchParams();
      params.append('page', (page || state.pagination.page).toString());
      params.append('limit', (limit || state.pagination.limit).toString());

      if (state.filters.filiere) params.append('filiere', state.filters.filiere);
      if (state.filters.niveau) params.append('niveau', state.filters.niveau);
      if (state.filters.statut) params.append('statut', state.filters.statut);
      if (state.searchTerm) params.append('search', state.searchTerm);

      const result = await api.get(`/api/students?${params.toString()}`);
      console.log('fetch students', result);
      
      dispatch({ type: "FETCH_STUDENTS_SUCCESS", payload: {students: result.data.data ?? [], pagination: result.data.pagination} });
      dispatch({ type: "SET_SUCCESS", payload: true });
    } catch (error: any) {
      handleApiError(
        error,
        (errors) => dispatch({ type: "SET_ERRORS", payload: errors }),
        (msg) => dispatch({ type: "SET_MESSAGE", payload: msg }),
        (type) => dispatch({ type: "SET_ERROR_TYPE", payload: type }),
        (cause) => dispatch({ type: "SET_CAUSE", payload: cause })
      );
    } finally {
      dispatch({ type: "SET_PROCESSING", payload: false });
    }
  }, [state.pagination.page, state.pagination.limit, state.filters, state.searchTerm]);

  const fetchStudentById = useCallback(async (id: number) => {
    dispatch({ type: "SET_PROCESSING", payload: true });
    dispatch({ type: "RESET_ERRORS" });

    try {
      const result = await api.get<IEtudiant>(`/api/students/${id}`);
      console.log('result fint student', result);
      
      dispatch({ type: "SET_SELECTED_STUDENT", payload: result.data });
      dispatch({ type: "SET_SUCCESS", payload: true });
    } catch (error: any) {
      handleApiError(
        error,
        (errors) => dispatch({ type: "SET_ERRORS", payload: errors }),
        (msg) => dispatch({ type: "SET_MESSAGE", payload: msg }),
        (type) => dispatch({ type: "SET_ERROR_TYPE", payload: type }),
        (cause) => dispatch({ type: "SET_CAUSE", payload: cause })
      );
    } finally {
      dispatch({ type: "SET_PROCESSING", payload: false });
    }
  }, []);

  const createStudent = useCallback(async (data: IEtudiantFormRequest) => {
    dispatch({ type: "SET_PROCESSING", payload: true });
    dispatch({ type: "RESET_ERRORS" });

    try {
      // const nom
      const created = await api.post<IEtudiant>('/api/students', data);
      dispatch({ type: "ADD_STUDENT", payload: created.data });
      dispatch({ type: "SET_SUCCESS", payload: true });
      dispatch({ type: "SET_MESSAGE", payload: "Étudiant créé avec succès" });
      await fetchStudents();
      navigate('/students');
      addToast({type: 'success', title: `Résultat de l'opération`, message: `Etudiant ${created.nom +' '+ created.prenom} créer avec succès`})
    } catch (error: any) {
      handleApiError(
        error,
        (errors) => dispatch({ type: "SET_ERRORS", payload: errors }),
        (msg) => dispatch({ type: "SET_MESSAGE", payload: msg }),
        (type) => dispatch({ type: "SET_ERROR_TYPE", payload: type }),
        (cause) => dispatch({ type: "SET_CAUSE", payload: cause })
      );
    } finally {
      dispatch({ type: "SET_PROCESSING", payload: false });
    }
  }, [fetchStudents]);

  const updateStudent = useCallback(async (id: number, data: IEtudiantUpdaterequest) => {
    dispatch({ type: "SET_PROCESSING", payload: true });
    dispatch({ type: "RESET_ERRORS" });
    
    try {
      const updated = await api.put<ApiResponseOk<IEtudiant>>(`/api/students/${id}`, data);
      dispatch({ type: "UPDATE_STUDENT", payload: updated.data });
      dispatch({ type: "SET_SUCCESS", payload: true });
      dispatch({ type: "SET_MESSAGE", payload: "Étudiant modifié avec succès" });
      navigate('/students');
      dispatch({ type: "TOGGLE_MODAL", payload: { modal: 'studentForm', isOpen: false } });
      addToast({type: 'success', title: `Résultat de l'opération`, message: `Etudiant ${updated?.data.nom +' '+updated?.data.prenom} mis à jour avec succès`})
    } catch (error: any) {
      handleApiError(
        error,
        (errors) => dispatch({ type: "SET_ERRORS", payload: errors }),
        (msg) => dispatch({ type: "SET_MESSAGE", payload: msg }),
        (type) => dispatch({ type: "SET_ERROR_TYPE", payload: type }),
        (cause) => dispatch({ type: "SET_CAUSE", payload: cause })
      );
    } finally {
      dispatch({ type: "SET_PROCESSING", payload: false });
    }
  }, []);
  
  const deleteStudent = useCallback(async (id: number) => {
    dispatch({ type: "SET_PROCESSING", payload: true });
    dispatch({ type: "RESET_ERRORS" });
    
    try {
      const foundStudent = state.students.find(e => e.id === id);
      const nom_complet = foundStudent?.nom + ' '+ foundStudent?.prenom
      await api.delete(`/api/students/${id}`);
      dispatch({ type: "DELETE_STUDENT", payload: id });
      dispatch({ type: "SET_SUCCESS", payload: true });
      dispatch({ type: "SET_MESSAGE", payload: "Étudiant supprimé avec succès" });
      dispatch({ type: "TOGGLE_MODAL", payload: { modal: 'studentDelete', isOpen: false } });
      addToast({type: 'success', title: `Résultat de l'opération`, message: `Etudiant ${nom_complet} supprimé avec succès`})
    } catch (error: any) {
      handleApiError(
        error,
        (errors) => dispatch({ type: "SET_ERRORS", payload: errors }),
        (msg) => dispatch({ type: "SET_MESSAGE", payload: msg }),
        (type) => dispatch({ type: "SET_ERROR_TYPE", payload: type }),
        (cause) => dispatch({ type: "SET_CAUSE", payload: cause })
      );
    } finally {
      dispatch({ type: "SET_PROCESSING", payload: false });
    }
  }, []);

  const toggleStudentStatus = useCallback(async (id: number, statut?: StatutEtudiant) => {
    dispatch({ type: "SET_PROCESSING", payload: true });
    dispatch({ type: "RESET_ERRORS" });
    
    try {
      const foundStudent = state.students.find(e => e.id === id);
      const nom_complet = foundStudent?.nom + ' '+ foundStudent?.prenom
      const updated = await api.post<IEtudiant>(`/api/students/${id}/toggle-statut`, { statut });
      // Vérifier que la réponse est valide
      if (!updated || !updated.data) {
        throw new Error('Réponse invalide de l\'API');
      }
      dispatch({ type: "UPDATE_STUDENT", payload: updated.data });
      dispatch({ type: "SET_SUCCESS", payload: true });
      dispatch({ type: "SET_MESSAGE", payload: "Statut modifié avec succès" });
      addToast({type: 'success', title: `Résultat de l'opération`, message: `Etudiant ${nom_complet} ${foundStudent?.statut === 'actif' ? 'désactivé': ''} ${foundStudent?.statut === 'inactif' ? 'activé': ''} avec succès`})
      
    } catch (error: any) {
      handleApiError(
        error,
        (errors) => dispatch({ type: "SET_ERRORS", payload: errors }),
        (msg) => dispatch({ type: "SET_MESSAGE", payload: msg }),
        (type) => dispatch({ type: "SET_ERROR_TYPE", payload: type }),
        (cause) => dispatch({ type: "SET_CAUSE", payload: cause })
      );
    } finally {
      dispatch({ type: "SET_PROCESSING", payload: false });
    }
  }, []);

  // ═══════════════════════ Related Data ═══════════════════════

  const fetchStudentCourses = useCallback(async (id: number) => {
    dispatch({ type: "SET_PROCESSING", payload: true });

    try {
      const result = await api.get<ICours[]>(`/api/students/${id}/courses`);
      console.log('result fetch Courses of students', result);
      
      dispatch({ type: "SET_STUDENT_COURSES", payload: result });
    } catch (error: any) {
      handleApiError(
        error,
        (errors) => dispatch({ type: "SET_ERRORS", payload: errors }),
        (msg) => dispatch({ type: "SET_MESSAGE", payload: msg }),
        (type) => dispatch({ type: "SET_ERROR_TYPE", payload: type }),
        (cause) => dispatch({ type: "SET_CAUSE", payload: cause })
      );
    } finally {
      dispatch({ type: "SET_PROCESSING", payload: false });
    }
  }, []);

  const fetchStudentNotes = useCallback(async (id: number) => {
    dispatch({ type: "SET_PROCESSING", payload: true });

    try {
      const result = await api.get<INote[]>(`/api/students/${id}/notes`);
      dispatch({ type: "SET_STUDENT_NOTES", payload: result });
    } catch (error: any) {
      handleApiError(
        error,
        (errors) => dispatch({ type: "SET_ERRORS", payload: errors }),
        (msg) => dispatch({ type: "SET_MESSAGE", payload: msg }),
        (type) => dispatch({ type: "SET_ERROR_TYPE", payload: type }),
        (cause) => dispatch({ type: "SET_CAUSE", payload: cause })
      );
    } finally {
      dispatch({ type: "SET_PROCESSING", payload: false });
    }
  }, []);

  const fetchStudentMoyenne = useCallback(async (id: number) => {
    dispatch({ type: "SET_PROCESSING", payload: true });

    try {
      const result = await api.get(`/api/students/${id}/moyenne`);
      dispatch({ type: "SET_STUDENT_MOYENNE", payload: result });
    } catch (error: any) {
      handleApiError(
        error,
        (errors) => dispatch({ type: "SET_ERRORS", payload: errors }),
        (msg) => dispatch({ type: "SET_MESSAGE", payload: msg }),
        (type) => dispatch({ type: "SET_ERROR_TYPE", payload: type }),
        (cause) => dispatch({ type: "SET_CAUSE", payload: cause })
      );
    } finally {
      dispatch({ type: "SET_PROCESSING", payload: false });
    }
  }, []);

  const fetchStats = useCallback(async () => {
    dispatch({ type: "SET_PROCESSING", payload: true });

    try {
      const stats = await api.get<StatsData>('/api/students/stats');
      dispatch({ type: "SET_STATS", payload: stats  });
      console.log('stat context',stats);
    } catch (error: any) {
      handleApiError(
        error,
        (errors) => dispatch({ type: "SET_ERRORS", payload: errors }),
        (msg) => dispatch({ type: "SET_MESSAGE", payload: msg }),
        (type) => dispatch({ type: "SET_ERROR_TYPE", payload: type }),
        (cause) => dispatch({ type: "SET_CAUSE", payload: cause })
      );
    } finally {
      dispatch({ type: "SET_PROCESSING", payload: false });
    }
  }, []);

  const searchStudents = useCallback(async (criteria: any) => {
    dispatch({ type: "SET_PROCESSING", payload: true });
    dispatch({ type: "RESET_ERRORS" });

    try {
      const rows = await api.post<IEtudiant[]>('/api/students/search/advanced', criteria);
      dispatch({ type: "FETCH_STUDENTS_SUCCESS", payload: {
        students: rows.data,
        pagination: state.pagination
      }});
    } catch (error: any) {
      handleApiError(
        error,
        (errors) => dispatch({ type: "SET_ERRORS", payload: errors }),
        (msg) => dispatch({ type: "SET_MESSAGE", payload: msg }),
        (type) => dispatch({ type: "SET_ERROR_TYPE", payload: type }),
        (cause) => dispatch({ type: "SET_CAUSE", payload: cause })
      );
    } finally {
      dispatch({ type: "SET_PROCESSING", payload: false });
    }
  }, [state.pagination]);

  // ═══════════════════════ Helper Functions ═══════════════════════

  const setSelectedStudent = useCallback((student: IEtudiant | null) => {
    dispatch({ type: "SET_SELECTED_STUDENT", payload: student });
  }, []);

  const setFilters = useCallback((filters: IEtudiantFilters) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  }, []);

  const setSearchTerm = useCallback((term: string) => {
    dispatch({ type: "SET_SEARCH_TERM", payload: term });
  }, []);

  const applyFilters = useCallback(async () => {
    await fetchStudents(1);
  }, [fetchStudents]);

  const resetFilters = useCallback(() => {
    dispatch({ type: "RESET_FILTERS" });
    fetchStudents(1);
  }, [fetchStudents]);

  const resetErrors = useCallback(() => {
    dispatch({ type: "RESET_ERRORS" });
  }, []);

  const setPagination = useCallback((pagination: Partial<PaginationState>) => {
    dispatch({ type: "SET_PAGINATION", payload: pagination });
  }, []);

  const setSortConfig = useCallback((config: SortConfig) => {
    dispatch({ type: "SET_SORT_CONFIG", payload: config });
  }, []);

  const toggleModal = useCallback((modal: keyof ModalStates, isOpen: boolean) => {
    dispatch({ type: "TOGGLE_MODAL", payload: { modal, isOpen } });
  }, []);

  // ═══════════════════════ Context Value ═══════════════════════

  const contextValue = useMemo(
    () => ({
      state,
      actions: {
        fetchStudents,
        fetchStudentById,
        createStudent,
        updateStudent,
        deleteStudent,
        toggleStudentStatus,
        fetchStudentCourses,
        fetchStudentNotes,
        fetchStudentMoyenne,
        fetchStats,
        searchStudents,
        setSelectedStudent,
        setFilters,
        setSearchTerm,
        applyFilters,
        resetFilters,
        resetErrors,
        setPagination,
        setSortConfig,
        toggleModal,
      },
    }),
    [
      state,
      fetchStudents,
      fetchStudentById,
      createStudent,
      updateStudent,
      deleteStudent,
      toggleStudentStatus,
      fetchStudentCourses,
      fetchStudentNotes,
      fetchStudentMoyenne,
      fetchStats,
      searchStudents,
      setSelectedStudent,
      setFilters,
      setSearchTerm,
      applyFilters,
      resetFilters,
      resetErrors,
      setPagination,
      setSortConfig,
      toggleModal,
    ]
  );

  return (
    <StudentContext.Provider value={contextValue}>
      {children}
    </StudentContext.Provider>
  );
};

// ─────────────────────────── Hook ─────────────────────────────

export const useStudents = (): StudentContextType => {
  const context = useContext(StudentContext);
  // console.log('student in content exporter', state.studens);
  
  if (!context) {
    throw new Error("useStudents doit être utilisé dans StudentProvider");
  }
  return context;
};