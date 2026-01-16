import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import clsx from 'clsx';
import type { JourSemaine, NiveauEtude } from '../../../types/api';
import { useCourses } from '../../../Contexts/CoursesContext';
import type { ICours } from '../../../types/ICours';
import { Input } from '../../components/Input';

const CourseForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, actions } = useCourses();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<Partial<ICours>>({
    code: '',
    nom: '',
    description: '',
    professeur: '',
    filiere: '',
    credits: 6,
    semestre: 'S1',
    capacite_max: 30,
    jour: undefined,
    heure_debut: '',
    heure_fin: '',
    salle: '',
    prerequis: '',
    statut: 'actif'
  });

  const [niveauxSelectionnes, setNiveauxSelectionnes] = useState<NiveauEtude[]>([]);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (isEditMode && id) {
      actions.fetchCourseById(Number(id));
    }
  }, [id, isEditMode]);

  useEffect(() => {
    if (isEditMode && state.selectedCourse) {
      setFormData(state.selectedCourse);
    }
  }, [state.selectedCourse, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleNiveauToggle = (niveau: NiveauEtude) => {
    setNiveauxSelectionnes(prev => {
      if (prev.includes(niveau)) {
        return prev.filter(n => n !== niveau);
      } else {
        return [...prev, niveau];
      }
    });
  };

  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!formData.code?.trim()) {
      newErrors.code = 'Le code du cours est requis';
    } else if (!/^[A-Z]{3}\d{3}$/.test(formData.code)) {
      newErrors.code = 'Le code doit être au format XXX123 (ex: INF101)';
    }

    if (!formData.nom?.trim()) {
      newErrors.nom = 'Le nom du cours est requis';
    }

    if (!formData.professeur?.trim()) {
      newErrors.professeur = 'Le nom du professeur est requis';
    }

    if (!formData.filiere?.trim()) {
      newErrors.filiere = 'La filière est requise';
    }

    if (!formData.credits || formData.credits < 1 || formData.credits > 12) {
      newErrors.credits = 'Les crédits doivent être entre 1 et 12';
    }

    if (!formData.capacite_max || formData.capacite_max < 1) {
      newErrors.capacite_max = 'La capacité doit être supérieure à 0';
    }

    if (formData.heure_debut && formData.heure_fin) {
      if (formData.heure_debut >= formData.heure_fin) {
        newErrors.heure_fin = 'L\'heure de fin doit être après l\'heure de début';
      }
    }

    if (niveauxSelectionnes.length === 0 && (!formData.niveaux || formData.niveaux.length === 0)) {
      newErrors.niveaux = 'Sélectionnez au moins un niveau';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const courseData = {
      ...formData,
      niveaux: niveauxSelectionnes
    };

    if (isEditMode && id) {
      await actions.updateCourse(Number(id), courseData);
    } else {
      await actions.createCourse(courseData);
    }

    if (state.success) {
      navigate('/courses');
    }
  };

  const handleCancel = () => {
    navigate('/courses');
  };

  const jours: JourSemaine[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const niveaux: NiveauEtude[] = ['L1', 'L2', 'L3', 'M1', 'M2'];
  const filieres = ['Informatique', 'Mathématiques', 'Physique', 'Chimie', 'Biologie'];

  return (
    <div className="mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">
              Tableau de bord
            </Link>
          </li>
          <li>
            <i className="ri-arrow-right-s-line text-gray-400"></i>
          </li>
          <li>
            <Link to="/courses" className="text-gray-500 hover:text-gray-700">
              Cours
            </Link>
          </li>
          <li>
            <i className="ri-arrow-right-s-line text-gray-400"></i>
          </li>
          <li className="text-gray-900 font-medium">
            {isEditMode ? 'Modifier le cours' : 'Nouveau cours'}
          </li>
        </ol>
      </nav>

      {/* En-tête */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center">
              <i className="ri-book-open-line text-2xl text-indigo-600"></i>
            </div>
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Modifier le cours' : 'Créer un nouveau cours'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isEditMode
                ? 'Modifiez les informations du cours'
                : 'Remplissez les informations pour créer un nouveau cours'}
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Informations de base
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input 
              labelText="Code du cours"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Ex: INF101"
              error={errors.code}
              inputStyle='px-3 py-3'
              required
            />

            <div>
              <label htmlFor="filiere" className="block text-sm font-medium text-gray-700">
                Filière <span className="text-red-500">*</span>
              </label>
              <select
                name="filiere"
                id="filiere"
                value={formData.filiere}
                onChange={handleChange}
                className={clsx(
                  'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500',
                  errors.filiere ? 'border-red-300' : 'border-gray-300'
                )}
              >
                <option value="">Sélectionnez une filière</option>
                {filieres.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
              {errors.filiere && (
                <p className="mt-1 text-sm text-red-600">{errors.filiere}</p>
              )}
            </div>
            <Input 
              labelText="nom du cours"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Ex: Programmation Python"
              error={errors.nom}
              inputStyle='px-3 py-3'
              contentStyle='sm: col-span-2'
              required
            />

            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez le contenu et les objectifs du cours..."
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <Input 
              labelText="professeur"
              name="professeur"
              value={formData.professeur}
              onChange={handleChange}
              placeholder="Ex: Paul Mbarga"
              error={errors.professeur}
              inputStyle='px-3 py-3'
              contentStyle=''
              required
            />
            <Input 
              labelText="prérequis"
              name="prerequis"
              value={formData.prerequis}
              onChange={handleChange}
              placeholder="Ex: Paul Mbarga"
              error={errors.prerequis}
              inputStyle='px-3 py-3'
              contentStyle=''
              
            />
          </div>
        </div>

        {/* Crédits et Capacité */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Crédits et capacité
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label htmlFor="credits" className="block text-sm font-medium text-gray-700">
                Crédits <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="credits"
                id="credits"
                min="1"
                max="12"
                value={formData.credits}
                onChange={handleChange}
                className={clsx(
                  'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500',
                  errors.credits ? 'border-red-300' : 'border-gray-300'
                )}
              />
              {errors.credits && (
                <p className="mt-1 text-sm text-red-600">{errors.credits}</p>
              )}
            </div>

            <div>
              <label htmlFor="semestre" className="block text-sm font-medium text-gray-700">
                Semestre <span className="text-red-500">*</span>
              </label>
              <select
                name="semestre"
                id="semestre"
                value={formData.semestre}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="S1">Semestre 1</option>
                <option value="S2">Semestre 2</option>
              </select>
            </div>

            <div>
              <label htmlFor="capacite_max" className="block text-sm font-medium text-gray-700">
                Capacité maximale <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="capacite_max"
                id="capacite_max"
                min="1"
                value={formData.capacite_max}
                onChange={handleChange}
                className={clsx(
                  'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500',
                  errors.capacite_max ? 'border-red-300' : 'border-gray-300'
                )}
              />
              {errors.capacite_max && (
                <p className="mt-1 text-sm text-red-600">{errors.capacite_max}</p>
              )}
            </div>
          </div>
        </div>

        {/* Niveaux autorisés */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Niveaux autorisés <span className="text-red-500">*</span>
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Sélectionnez les niveaux d'études autorisés pour ce cours
          </p>

          <div className="flex flex-wrap gap-3">
            {niveaux.map(niveau => (
              <button
                key={niveau}
                type="button"
                onClick={() => handleNiveauToggle(niveau)}
                className={clsx(
                  'px-4 py-2 rounded-lg border-2 font-medium transition-colors',
                  niveauxSelectionnes.includes(niveau) || formData.niveaux === niveau
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                )}
              >
                {niveau}
              </button>
            ))}
          </div>
          {errors.niveaux && (
            <p className="mt-2 text-sm text-red-600">{errors.niveaux}</p>
          )}
        </div>

        {/* Planning */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Planning (optionnel)
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="jour" className="block text-sm font-medium text-gray-700">
                Jour de la semaine
              </label>
              <select
                name="jour"
                id="jour"
                value={formData.jour || ''}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Non défini</option>
                {jours.map(j => (
                  <option key={j} value={j}>{j}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="salle" className="block text-sm font-medium text-gray-700">
                Salle
              </label>
              <input
                type="text"
                name="salle"
                id="salle"
                value={formData.salle}
                onChange={handleChange}
                placeholder="Ex: Salle B201"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="heure_debut" className="block text-sm font-medium text-gray-700">
                Heure de début
              </label>
              <input
                type="time"
                name="heure_debut"
                id="heure_debut"
                value={formData.heure_debut}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="heure_fin" className="block text-sm font-medium text-gray-700">
                Heure de fin
              </label>
              <input
                type="time"
                name="heure_fin"
                id="heure_fin"
                value={formData.heure_fin}
                onChange={handleChange}
                className={clsx(
                  'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500',
                  errors.heure_fin ? 'border-red-300' : 'border-gray-300'
                )}
              />
              {errors.heure_fin && (
                <p className="mt-1 text-sm text-red-600">{errors.heure_fin}</p>
              )}
            </div>
          </div>
        </div>

        {/* Statut */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Statut du cours
          </h2>

          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="statut"
                value="actif"
                checked={formData.statut === 'actif'}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Actif</span>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="statut"
                value="brouillon"
                checked={formData.statut === 'brouillon'}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Brouillon</span>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="statut"
                value="archive"
                checked={formData.statut === 'archive'}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Archivé</span>
            </label>
          </div>
        </div>

        {/* Messages d'erreur globaux */}
        {state.message && !state.success && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <i className="ri-error-warning-line text-red-400 text-xl"></i>
              <div className="ml-3">
                <p className="text-sm text-red-800">{state.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={state.processing}
            className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={state.processing}
            className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state.processing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditMode ? 'Mise à jour...' : 'Création...'}
              </>
            ) : (
              <>
                <i className={clsx('mr-2', isEditMode ? 'ri-save-line' : 'ri-add-line')}></i>
                {isEditMode ? 'Mettre à jour' : 'Créer le cours'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;