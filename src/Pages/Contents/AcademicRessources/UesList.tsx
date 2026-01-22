import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import type { IUniteEnseignementFilters } from '../../../types/ICours';
import type { IUniteEnseignementWithDetails } from '../../../types/ICours';
import { Button } from '../../components/Button';

const UEList: React.FC = () => {
  const { state, actions } = useUE();
  const [filters, setFilters] = useState<IUniteEnseignementFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    actions.fetchUEs(1, 10, filters);
  }, []);

  const handleFilterChange = (key: keyof IUniteEnseignementFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    actions.fetchUEs(1, state.pagination.limit, filters);
  };

  const handleResetFilters = () => {
    setFilters({});
    actions.fetchUEs(1, state.pagination.limit);
  };

  const handlePageChange = (newPage: number) => {
    actions.fetchUEs(newPage, state.pagination.limit, filters);
  };

  const handleEdit = (ue: IUniteEnseignementWithDetails) => {
    navigate(`/ue/${ue.code}/edit`);
  };

  const handleDelete = (ue: IUniteEnseignementWithDetails) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'UE "${ue.nom}" ?`)) {
      actions.deleteUE(ue.code!);
    }
  };

  const handleViewDetails = (ue: IUniteEnseignementWithDetails) => {
    navigate(`/ue/${ue.code}`);
  };

  const getTypeUEColor = (type?: TypeUE) => {
    switch (type) {
      case 'OBLIGATOIRE': return 'bg-red-100 text-red-800';
      case 'OPTIONNEL': return 'bg-blue-100 text-blue-800';
      case 'TRANSVERSAL': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeUELabel = (type?: TypeUE) => {
    const labels: Record<TypeUE, string> = {
      'OBLIGATOIRE': 'Obligatoire',
      'OPTIONNEL': 'Optionnel',
      'TRANSVERSAL': 'Transversal'
    };
    return type ? labels[type] : '—';
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Unités d'Enseignement</h1>
          <p className="mt-1 text-sm text-gray-500">
            {state.pagination.total} UE au total
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
            action={() => {navigate('/ue/create');}}
            supStyle="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Nouvelle UE
          </Button>
        </div>
      </div>

      {/* Filtres */}
      {showFilters && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Recherche */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recherche
              </label>
              <input
                type="text"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Code ou nom de l'UE..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Type UE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type d'UE
              </label>
              <select
                title='type'
                value={filters.type || ''}
                onChange={(e) => handleFilterChange('type', e.target.value as TypeUE)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Tous</option>
                <option value="OBLIGATOIRE">Obligatoire</option>
                <option value="OPTIONNEL">Optionnel</option>
                <option value="TRANSVERSAL">Transversal</option>
              </select>
            </div>

            {/* Groupe de cours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Groupe de cours
              </label>
              <input
                type="text"
                value={filters.groupe_cours_code || ''}
                onChange={(e) => handleFilterChange('groupe_cours_code', e.target.value)}
                placeholder="Code groupe..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Filière */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filière
              </label>
              <input
                type="text"
                value={filters.filiere_code || ''}
                onChange={(e) => handleFilterChange('filiere_code', e.target.value)}
                placeholder="Code filière..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Crédits min */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Crédits minimum
              </label>
              <input
                type="number"
                min="0"
                value={filters.credits_min || ''}
                onChange={(e) => handleFilterChange('credits_min', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Crédits max */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Crédits maximum
              </label>
              <input
                type="number"
                min="0"
                value={filters.credits_max || ''}
                onChange={(e) => handleFilterChange('credits_max', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="12"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Volume horaire min */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Volume horaire min
              </label>
              <input
                type="number"
                min="0"
                value={filters.volume_horaire_min || ''}
                onChange={(e) => handleFilterChange('volume_horaire_min', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Avec matières */}
            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.avec_matieres || false}
                  onChange={(e) => handleFilterChange('avec_matieres', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Avec matières</span>
              </label>
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

      {/* Liste des UE */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {state.processing && !state.ues.length ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : state.ues.length === 0 ? (
          <div className="text-center py-12">
            <i className="ri-book-open-line text-6xl text-gray-400"></i>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune UE trouvée</h3>
            <p className="mt-2 text-sm text-gray-500">
              Commencez par créer une nouvelle unité d'enseignement
            </p>
            <button
              onClick={() => navigate('/ue/create')}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <i className="ri-add-line mr-2"></i>
              Créer une UE
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
                      Nom de l'UE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Crédits
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Volume H.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Matières
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {state.ues.map((ue: IUniteEnseignementWithDetails) => (
                    <tr 
                      key={ue.code} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleViewDetails(ue)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {ue.code}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {ue.nom}
                        </div>
                        {ue.description && (
                          <div className="text-sm text-gray-500 truncate max-w-md">
                            {ue.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={clsx(
                          'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                          getTypeUEColor(ue.type)
                        )}>
                          {getTypeUELabel(ue.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ue.credits}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ue.volume_horaire_total}h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ue.matieres?.length || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(ue);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Voir détails"
                          >
                            <i className="ri-eye-line text-lg"></i>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(ue);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Modifier"
                          >
                            <i className="ri-edit-line text-lg"></i>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(ue);
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Supprimer"
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
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() => handlePageChange(state.pagination.page + 1)}
                    disabled={state.pagination.page === state.pagination.totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Suivant
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Page <span className="font-medium">{state.pagination.page}</span> sur{' '}
                      <span className="font-medium">{state.pagination.totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => handlePageChange(state.pagination.page - 1)}
                        disabled={state.pagination.page === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <i className="ri-arrow-left-s-line"></i>
                      </button>
                      {[...Array(state.pagination.totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => handlePageChange(i + 1)}
                          className={clsx(
                            'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                            state.pagination.page === i + 1
                              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          )}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(state.pagination.page + 1)}
                        disabled={state.pagination.page === state.pagination.totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
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

      {/* Message d'erreur */}
      {state.message && !state.success && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="ri-error-warning-line text-red-400 text-xl"></i>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{state.message}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UEList;