import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useCourses } from '../../../Contexts/CoursesContext';
import type { ICoursFilters, NiveauEtude, Semestre } from '../../../types/api';
import type { ICours } from '../../../types/ICours';
import { Button } from '../../components/Button';

const CoursesList: React.FC = () => {
  const { state, actions } = useCourses();
  const [filters, setFilters] = useState<ICoursFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    actions.fetchCourses(1, 7, filters);
  }, []);

  const handleFilterChange = (key: keyof ICoursFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    actions.fetchCourses(1, state.pagination.limit, filters);
  };

  const handleResetFilters = () => {
    setFilters({});
    actions.fetchCourses(1, state.pagination.limit);
  };

  const handlePageChange = (newPage: number) => {
    actions.fetchCourses(newPage, state.pagination.limit, filters);
  };

  const handleEdit = (course: ICours) => {
    navigate(`/courses/${course.id}/edit`);
  };

  const handleDelete = (course: ICours) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le cours "${course.nom}" ?`)) {
      actions.deleteCourse(course.id!);
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'actif': return 'bg-green-100 text-green-800';
      case 'archive': return 'bg-gray-100 text-gray-800';
      case 'brouillon': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des cours</h1>
          <p className="mt-1 text-sm text-gray-500">
            {state.pagination.total} cours au total
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <i className="ri-filter-line mr-2"></i>
            Filtres
            {showFilters && <i className="ri-arrow-up-s-line ml-2"></i>}
            {!showFilters && <i className="ri-arrow-down-s-line ml-2"></i>}
          </button>
          <Button
            variant='perso'
            icon='ri-add-line mr-1 font-bold'
            iconPosition='left'
            action={() => {navigate('/courses/create');}}
            supStyle="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Nouveau cours
          </Button>
        </div>
      </div>

      {/* Filtres */}
      {showFilters && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recherche
              </label>
              <input
                type="text"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Nom ou code du cours..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filière
              </label>
              <select
                title='filière'
                value={filters.filiere || ''}
                onChange={(e) => handleFilterChange('filiere', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Toutes</option>
                <option value="Informatique">Informatique</option>
                <option value="Mathématiques">Mathématiques</option>
                <option value="Physique">Physique</option>
                <option value="Chimie">Chimie</option>
                <option value="Biologie">Biologie</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Niveau
              </label>
              <select
                title='filière'
                value={filters.niveau || ''}
                onChange={(e) => handleFilterChange('niveau', e.target.value as NiveauEtude)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Tous</option>
                <option value="L1">L1</option>
                <option value="L2">L2</option>
                <option value="L3">L3</option>
                <option value="M1">M1</option>
                <option value="M2">M2</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Semestre
              </label>
              <select
                title='semestre'
                value={filters.semestre || ''}
                onChange={(e) => handleFilterChange('semestre', e.target.value as Semestre)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Tous</option>
                <option value="S1">S1</option>
                <option value="S2">S2</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Professeur
              </label>
              <input
                type="text"
                value={filters.professeur || ''}
                onChange={(e) => handleFilterChange('professeur', e.target.value)}
                placeholder="Nom du professeur..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                title='statut'
                value={filters.statut || ''}
                onChange={(e) => handleFilterChange('statut', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Tous</option>
                <option value="actif">Actif</option>
                <option value="archive">Archivé</option>
                <option value="brouillon">Brouillon</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleApplyFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <i className="ri-search-line mr-2"></i>
              Appliquer les filtres
            </button>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <i className="ri-restart-line mr-2"></i>
              Réinitialiser
            </button>
          </div>
        </div>
      )}

      {/* Liste des cours */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {state.processing && !state.courses.length ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : state.courses.length === 0 ? (
          <div className="text-center py-12">
            <i className="ri-book-open-line text-6xl text-gray-400"></i>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun cours trouvé</h3>
            <p className="mt-2 text-sm text-gray-500">
              Commencez par créer un nouveau cours
            </p>
            <button
              onClick={() => {/* Ouvrir modal création */}}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <i className="ri-add-line mr-2"></i>
              Créer un cours
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom du cours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Professeur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Filière
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Crédits
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Semestre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capacité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {state.courses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {course.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{course.nom}</div>
                        {course.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {course.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.professeur}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.filiere}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.credits}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.semestre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.capacite_actuelle || 0} / {course.capacite_max}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={clsx(
                          'inline-flex rounded-full px-2 py-1 text-xs font-semibold',
                          getStatusColor(course.statut)
                        )}>
                          {course.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/courses/${course.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <i className="ri-eye-line text-lg"></i>
                          </Link>
                          <button
                            title='edit_course'
                            onClick={() => handleEdit(course)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <i className="ri-edit-line text-lg"></i>
                          </button>
                          <button
                            title='delete_course'
                            onClick={() => handleDelete(course)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <i className="ri-delete-bin-line text-lg"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {state.pagination.totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(state.pagination.page - 1)}
                    disabled={state.pagination.page === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() => handlePageChange(state.pagination.page + 1)}
                    disabled={state.pagination.page === state.pagination.totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Affichage de{' '}
                      <span className="font-medium">
                        {(state.pagination.page - 1) * state.pagination.limit + 1}
                      </span>{' '}
                      à{' '}
                      <span className="font-medium">
                        {Math.min(
                          state.pagination.page * state.pagination.limit,
                          state.pagination.total
                        )}
                      </span>{' '}
                      sur{' '}
                      <span className="font-medium">{state.pagination.total}</span> cours
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        title='prev_page'
                        onClick={() => handlePageChange(state.pagination.page - 1)}
                        disabled={state.pagination.page === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="ri-arrow-left-s-line"></i>
                      </button>
                      {Array.from({ length: state.pagination.totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                          return (
                            page === 1 ||
                            page === state.pagination.totalPages ||
                            Math.abs(page - state.pagination.page) <= 2
                          );
                        })
                        .map((page, index, array) => (
                          <React.Fragment key={page}>
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                ...
                              </span>
                            )}
                            <button
                              onClick={() => handlePageChange(page)}
                              className={clsx(
                                'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                                page === state.pagination.page
                                  ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              )}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        ))}
                      <button
                        title='next_page'
                        onClick={() => handlePageChange(state.pagination.page + 1)}
                        disabled={state.pagination.page === state.pagination.totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="ri-arrow-right-s-line"></i>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CoursesList;