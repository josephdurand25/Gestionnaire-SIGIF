import React, { useState, useEffect } from 'react';
import { useStudents } from '../../../Contexts/StudentsContext';
import clsx from 'clsx';
import { useNavigate, useParams } from 'react-router';
import { Button } from '../../components/Button';
import { Select } from '../../components/Select';
import { Input } from '../../components/Input';

interface StudentFormModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  studentId?: number;
}

const StudentForm: React.FC<StudentFormModalProps> = () => {
  const { state, actions } = useStudents();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { createStudent} = actions;
  const isEdit = !!id || !!state.selectedStudent;

  const [formData, setFormData] = useState({
    numero_etudiant: '',
    prenom: '',
    nom: '',
    date_naissance: '',
    genre: '',
    email: '',
    telephone: '',
    adresse_rue: '',
    adresse_ville: '',
    adresse_code_postal: '',
    adresse_pays: '',
    date_inscription: '',
    filiere: '',
    niveau: '',
  });

  useEffect(() => {
    if (isEdit && state.selectedStudent) {
      setFormData({
        numero_etudiant: state.selectedStudent.numero_etudiant || '',
        prenom: state.selectedStudent.prenom || '',
        nom: state.selectedStudent.nom || '',
        date_naissance: state.selectedStudent.date_naissance?.split('T')[0] || '',
        genre: state.selectedStudent.genre || '',
        email: state.selectedStudent.email || '',
        telephone: state.selectedStudent.telephone || '',
        adresse_rue: state.selectedStudent.adresse_rue || '',
        adresse_ville: state.selectedStudent.adresse_ville || '',
        adresse_code_postal: state.selectedStudent.adresse_code_postal || '',
        adresse_pays: state.selectedStudent.adresse_pays || '',
        date_inscription: state.selectedStudent.date_inscription?.split('T')[0] || '',
        filiere: state.selectedStudent.filiere || '',
        niveau: state.selectedStudent.niveau || '',
      });
    } else {
      // Reset form for new student
      setFormData({
        numero_etudiant: '',
        prenom: '',
        nom: '',
        date_naissance: '',
        genre: '',
        email: '',
        telephone: '',
        adresse_rue: '',
        adresse_ville: '',
        adresse_code_postal: '',
        adresse_pays: '',
        date_inscription: new Date().toISOString().split('T')[0],
        filiere: '',
        niveau: ''
      });
    }
  }, [isEdit, state.selectedStudent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFormData({
        numero_etudiant: '',
        prenom: '',
        nom: '',
        date_naissance: '',
        genre: '',
        email: '',
        telephone: '',
        adresse_rue: '',
        adresse_ville: '',
        adresse_code_postal: '',
        adresse_pays: '',
        date_inscription: new Date().toISOString().split('T')[0],
        filiere: '',
        niveau: ''
      });
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit && state.selectedStudent) {
      await actions.updateStudent(state.selectedStudent.id, formData);
    } else {
      await actions.createStudent({
        ...formData,
        created_by: 1, // À remplacer par l'ID de l'utilisateur connecté
      } as any);
    }

    if (state.success) {
      // onClose();
    }
  };

  // if (!isOpen) return null;

  return (
    <div className="w-full">
    {/* <div className="fixed inset-0 z-50 overflow-y-auto"> */}
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between my-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Modifier l\'étudiant' : 'Nouvel étudiant'}
          </h1>

          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              action={() => {actions.setSelectedStudent(null); navigate('/students');}}
              supStyle="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
            >
              <i className="ri-list-view-line mr-2"></i>
              Liste des étudiants
            </Button>
          </div>
      </div>
      <div className="w-full rounded-lg  shadow-xl transition-all">

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-6 py-4 mt-2">
            {/* Erreurs */}
            {state.message && state.errorType && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <i className="ri-error-warning-line text-red-400 mr-3"></i>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-800">{state.message}</h3>
                    {Object.keys(state.errors).length > 0 && (
                      <ul className="mt-2 list-disc list-inside text-sm text-red-700">
                        {Object.entries(state.errors).map(([field, error]) => (
                          <li key={field}>{error}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Informations personnelles */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Informations personnelles</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numéro étudiant *
                    </label>
                    <input
                      type="text"
                      name="numero_etudiant"
                      value={formData.numero_etudiant}
                      onChange={handleChange}
                      required
                      className={clsx(
                        "block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
                        state.errors.numero_etudiant ? "ring-red-300" : "ring-gray-300"
                      )}
                    />
                  </div> */}

                  <div>
                    {/* <label className="block text-sm font-medium text-gray-700 mb-1">
                      Genre *
                    </label> */}
                    <Select
                      title='gentre'
                      labelText="Genre "
                      requis
                      indication=" Sélectionner"
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      styleSelect="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    
                       options={[
                          { id: 1, value: "homme", label: "Masculin" },
                          { id: 2, value: "femme", label: "Féminin" },
                          { id: 3, value: "autre", label: "Autre" },
                           
                        ]}
                    />
                  </div>

                  <div>
                    {/* <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom *
                    </label> */}
                    <Input
                      title='prenom'
                      labelText="Prénom "
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      required
                      inputStyle="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div>
                    {/* <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom *
                    </label> */}
                    <Input
                      title='nom'
                      type="text"
                      labelText='Nom'
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                      inputStyle="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div>
                    {/* <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de naissance *
                    </label> */}
                    <Input
                      title='date naissance'
                      type="date"
                      labelText='Date de naissance'
                      name="date_naissance"
                      value={formData.date_naissance}
                      onChange={handleChange}
                      required
                      inputStyle="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div>
                    {/* <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date d'inscription *
                    </label> */}
                    <Input
                      title='date inscription'
                      type="date"
                      labelText='Date inscription'
                      name="date_inscription"
                      value={formData.date_inscription}
                      onChange={handleChange}
                      required
                      inputStyle="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Contact</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    {/* <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label> */}
                    <Input
                      title='email'
                      type="email"
                      labelText='Email'
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      inputStyle="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div>
                 
                    <Input
                      title='téléphone'
                      type="tel"
                      labelText='Téléphone'
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      inputStyle="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              {/* Adresse */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Adresse</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    {/* <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rue
                    </label> */}
                    <Input
                      title='rue'
                      type="text"
                      labelText='Rue'
                      name="adresse_rue"
                      value={formData.adresse_rue}
                      onChange={handleChange}
                      inputStyle="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div>
                   
                    <Input
                      title='ville'
                      type="text"
                      labelText='Ville'
                      name="adresse_ville"
                      value={formData.adresse_ville}
                      onChange={handleChange}
                      inputStyle="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div>
                    
                    <Input
                      title='code postale'
                      type="text"
                      labelText='Code postal'
                      name="adresse_code_postal"
                      value={formData.adresse_code_postal}
                      onChange={handleChange}
                      inputStyle="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    
                    <Input
                      title='pays'
                      labelText='Pays'
                      type="text"
                      name="adresse_pays"
                      value={formData.adresse_pays}
                      onChange={handleChange}
                      inputStyle="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              {/* Informations académiques */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Informations académiques</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    
                    <Select
                      title='filière'
                      labelText='Filière'
                      indication='Sélectionner'
                      requis
                      name="filiere"
                      value={formData.filiere}
                      onChange={handleChange}
                      
                      styleSelect="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    
                     options={[
                        { id: 1, value: "Informatique", label: "Informatique" },
                        { id: 2, value: "Mathématiques", label: "Mathématiques" },
                        { id: 3, value: "Physique", label: "Physique" },
                        { id: 4, value: "Chimie", label: "Chimie" },
                        { id: 5, value: "Biologie", label: "Biologie" }  
                      ]}
                    
                    />
                  </div>

                  <div>
                   
                    <Select
                      title='niveau'
                      name="niveau"
                      labelText='Niveau'
                      indication='Sélectionner'
                      value={formData.niveau}
                      onChange={handleChange}
                      requis
                      styleSelect="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      
                      options={[
                        { id: 1, value: "L1", label: "Licence 1" },
                        { id: 2, value: "L2", label: "Licence 2" },
                        { id: 3, value: "L3", label: "Licence 3" },
                        { id: 4, value: "M1", label: "Master 1" },
                        { id: 5, value: "M2", label: "Master 2" }  
                      ]}
                     
                    />
                  </div>

                  {/* {isEdit && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Statut *
                      </label>
                      <select
                        name="statut"
                        value={formData.statut}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option value="actif">Actif</option>
                        <option value="inactif">Inactif</option>
                        <option value="suspendu">Suspendu</option>
                        <option value="diplome">Diplômé</option>
                      </select>
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex justify-end gap-3">
              <Button
                variant='perso'
                type="button"
                action={handleClear}
                supStyle="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
              Vider les champs
              </Button>
              <Button
                type="submit"
                variant='perso'
                disabled={state.processing}
                supStyle="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
              >
                {state.processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <i className="ri-save-line mr-2"></i>
                    {isEdit ? 'Mettre à jour' : 'Créer'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;