import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { StudentProvider } from '../../Contexts/StudentsContext';
import { Footer } from './Footer';
import { SidebarLinkGroup } from '../components/SidebarLinkGroup';

interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  submenu?: { name: string; href: string }[];
}

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { pathname } = location;
  
  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  const navigation: NavigationItem[] = [
    { 
      name: 'Tableau de bord', 
      href: '/', 
      icon: 'ri-dashboard-line' 
    },
    { 
      name: 'Candidatures', 
      href: '/candidats', 
      icon: 'ri-user-line',
      submenu: [
        { name: 'Liste des candidatures', href: '/candidats' },
        { name: 'Créer un candidature', href: '/candidats/create' },
        { name: 'Statistiques', href: '/candidats/statistics' }
      ]
    },
    { 
      name: 'Étudiants', 
      href: '/students', 
      icon: 'ri-user-line',
      submenu: [
        { name: 'Liste des étudiants', href: '/students' },
        { name: 'Créer un étudiant', href: '/students/create' },
        { name: 'Statistiques', href: '/students/statistics' }
      ]
    },
    { 
      name: 'Academic resources', 
      href: '/academic', 
      icon: 'ri-user-line',
      submenu: [
        { name: 'Liste des étudiants', href: '/academic' },
        { name: 'Créer un étudiant', href: '/academic/create' },
        { name: 'Statistiques', href: '/academic/statistics' }
      ]
    },
    { 
      name: 'Matiere', 
      href: '/matieres', 
      icon: 'ri-book-line',
      submenu: [
        { name: 'Liste des matieres', href: '/matieres' },
        { name: 'Créer un matieres', href: '/matieres/create' },
        { name: 'Assigner des matieres', href: '/matieres/assign' }
      ]
    },
    { 
      name: 'Cours', 
      href: '/courses', 
      icon: 'ri-book-line',
      submenu: [
        { name: 'Liste des cours', href: '/courses' },
        { name: 'Créer un cours', href: '/courses/create' },
        { name: 'Assigner des cours', href: '/courses/assign' }
      ]
    },
    { 
      name: 'Notes', 
      href: '/grades', 
      icon: 'ri-file-list-3-line',
      submenu: [
        { name: 'Gestion des notes', href: '/grades' },
        { name: 'Bulletins', href: '/grades/reports' },
        { name: 'Moyennes', href: '/grades/averages' }
      ]
    },
    { 
      name: 'Gestion Académique', 
      href: '/academic', 
      icon: 'ri-graduation-cap-line',
      submenu: [
        { name: 'Filières', href: '/academic/filiere' },
        { name: 'Niveaux', href: '/academic/niveau' },
        { name: 'Années académiques', href: '/academic/years' }
      ]
    },
    { 
      name: 'Administration', 
      href: '/admin', 
      icon: 'ri-settings-3-line',
      submenu: [
        { name: 'Utilisateurs', href: '/admin/users' },
        { name: 'Permissions', href: '/admin/permissions' },
        { name: 'Logs système', href: '/admin/logs' },
        { name: 'Sauvegarde', href: '/admin/backup' }
      ]
    }
  ];

  const toggleSidebarExpanded = () => {
    const newValue = !sidebarExpanded;
    setSidebarExpanded(newValue);
    localStorage.setItem("sidebar-expanded", newValue.toString());
  };

  return (
    <StudentProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar pour mobile */}
        <div
          className={clsx(
            'fixed inset-0 z-40 lg:hidden transition-opacity duration-300',
            sidebarOpen ? 'block' : 'hidden'
          )}>
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex min-h-0 flex-1 flex-col">
              {/* Header mobile sidebar */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h1 className="text-xl font-bold text-indigo-600">
                  <i className="ri-graduation-cap-line mr-2"></i>
                  Student Manager
                </h1>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
              
              {/* Navigation mobile */}
              <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-2">
                  {navigation.map((item) => (
                    <div key={item.name}>
                      {item.submenu ? (
                        <SidebarLinkGroup 
                          activecondition={pathname.includes(item.href.split('/')[1])}
                        >
                          {(handleClick, open) => (
                            <>
                              <button
                                onClick={handleClick}
                                className={clsx(
                                  'w-full group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                  pathname.includes(item.href.split('/')[1])
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                )}
                              >
                                <div className="flex items-center">
                                  <i className={clsx(item.icon, 'mr-3 text-lg')}></i>
                                  {item.name}
                                </div>
                                <i className={clsx(
                                  'ri-arrow-down-s-line transition-transform duration-200',
                                  open && 'rotate-180'
                                )}></i>
                              </button>
                              
                              {open && (
                                <div className="mt-1 ml-8 space-y-1">
                                  {item.submenu.map((subItem) => (
                                    <NavLink
                                      key={subItem.name}
                                      to={subItem.href}
                                      onClick={() => setSidebarOpen(false)}
                                      className={({ isActive }) =>
                                        clsx(
                                          'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                          isActive
                                            ? 'bg-indigo-100 text-indigo-700'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        )
                                      }
                                    >
                                      {subItem.name}
                                    </NavLink>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </SidebarLinkGroup>
                      ) : (
                        <NavLink
                          to={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={({ isActive }) =>
                            clsx(
                              'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                              isActive
                                ? 'bg-indigo-50 text-indigo-600'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            )
                          }
                        >
                          <i className={clsx(item.icon, 'mr-3 text-lg')}></i>
                          {item.name}
                        </NavLink>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
              
              {/* Profile mobile sidebar */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                      <i className="ri-user-line"></i>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">Administrateur</p>
                    <p className="text-xs text-gray-500">admin@studentmanager.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar pour desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white shadow-sm">
            {/* Desktop sidebar header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-indigo-600">
                <i className="ri-graduation-cap-line mr-2"></i>
                Student Manager
              </h1>
              <button
                onClick={toggleSidebarExpanded}
                className="text-gray-400 hover:text-gray-500"
                title={sidebarExpanded ? "Réduire la sidebar" : "Étendre la sidebar"}
              >
                <i className={clsx(
                  'ri-arrow-left-s-line transition-transform duration-200',
                  sidebarExpanded && 'rotate-180'
                )}></i>
              </button>
            </div>
            
            {/* Navigation desktop */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav className=" px-2">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.submenu ? (
                      <SidebarLinkGroup 
                        activecondition={pathname.includes(item.href.split('/')[1])}
                      >
                        {(handleClick, open) => (
                          <>
                            <button
                              onClick={handleClick}
                              className={clsx(
                                'w-full group flex items-center justify-between rounded-md px-3 py-1 text-sm font-medium transition-colors',
                                pathname.includes(item.href.split('/')[1])
                                  ? 'bg-indigo-50 text-indigo-600'
                                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                              )}
                            >
                              <div className="flex items-center">
                                <i className={clsx(item.icon, 'mr-3 text-lg')}></i>
                                <span className={clsx(
                                  'transition-opacity duration-200',
                                  sidebarExpanded ? 'opacity-100' : 'opacity-0 w-0'
                                )}>
                                  {item.name}
                                </span>
                              </div>
                              <i className={clsx(
                                'ri-arrow-down-s-line transition-all duration-200',
                                open && 'rotate-180',
                                sidebarExpanded ? 'opacity-100' : 'opacity-0'
                              )}></i>
                            </button>
                            
                            {open && sidebarExpanded && (
                              <div className="mt-1 ml-8 space-y-1">
                                {item.submenu?.map((subItem) => (
                                  <NavLink
                                    key={subItem.name}
                                    to={subItem.href}
                                    className={({ isActive }) =>
                                      clsx(
                                        'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                        isActive
                                          ? 'bg-indigo-100 text-indigo-700'
                                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                      )
                                    }
                                  >
                                    {subItem.name}
                                  </NavLink>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </SidebarLinkGroup>
                    ) : (
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          clsx(
                            'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                            isActive
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                          )
                        }
                      >
                        <i className={clsx(item.icon, 'mr-3 text-lg')}></i>
                        <span className={clsx(
                          'transition-opacity duration-200',
                          sidebarExpanded ? 'opacity-100' : 'opacity-0 w-0'
                        )}>
                          {item.name}
                        </span>
                      </NavLink>
                    )}
                  </div>
                ))}
              </nav>
            </div>
            
            {/* Profile desktop sidebar */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                    <i className="ri-user-line"></i>
                  </div>
                </div>
                <div className={clsx(
                  'ml-3 transition-all duration-200 overflow-hidden',
                  sidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                )}>
                  <p className="text-sm font-medium text-gray-700 whitespace-nowrap">Administrateur</p>
                  <p className="text-xs text-gray-500 whitespace-nowrap">admin@studentmanager.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className={clsx(
          'flex flex-col flex-1 transition-all duration-300',
          sidebarExpanded ? 'lg:pl-64' : 'lg:pl-20'
        )}>
          {/* Header mobile */}
          <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow lg:hidden">
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Ouvrir le menu</span>
              <i className="ri-menu-line text-2xl"></i>
            </button>
            <div className="flex flex-1 justify-between px-4">
              <div className="flex flex-1 items-center">
                <h1 className="text-lg font-semibold text-gray-900">
                  {navigation.find(item => 
                    item.href === location.pathname || 
                    item.submenu?.some(sub => sub.href === location.pathname)
                  )?.name || 'Student Manager'}
                </h1>
              </div>
            </div>
          </div>

          {/* Contenu de la page */}
          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto max-w-8xl px-4 sm:px-6 md:px-8">
                {/* Contenu de la page */}
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </StudentProvider>
  );
};

export default DashboardLayout;