import { createBrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import DashboardLayout from './Pages/Layouts/DashboardLayout';
import { ToastProvider } from './Contexts/TaostContainer';
import { useEffect } from 'react';
import Dashboard from './Pages/Contents/Dashboard';
import StudentsList from './Pages/Contents/StudentsList';
import Statistics from './Pages/Contents/Statistics';
import StudentForm from './Pages/Contents/FormDataStudent';
import StudentDetails from './Pages/Contents/StudentDetail';
import CoursesList from './Pages/Contents/Courses/List';
import CoursesContentLayout from './Pages/Layouts/CourseLayout';
import CourseForm from './Pages/Contents/Courses/Form';
import CourseDetails from './Pages/Contents/Courses/Details';

const App: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    document.querySelector('html')!.style.scrollBehavior = 'auto';
    window.scroll({ top: 0 });
    document.querySelector('html')!.style.scrollBehavior = '';
  }, [location.pathname]);

  return (
    <ToastProvider>
      {/* <AuthProvider> */}
        <Routes>
          {/* Route publique */}
          {/* <Route path="/" element={<LoginPage />} />
          {/* Routes protégées */}
          {/* <Route element={<ProtectedRoute />}> */}
            <Route element={<DashboardLayout />}>
              {/* Routes principales */}
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="students" element={<StudentsList />} />
              <Route path="students/:id" element={<StudentDetails  />} />
              <Route path="students/create" element={<StudentForm />} />
              <Route path="students/edit/:id" element={<StudentForm />} />
              <Route path="students/statistics" element={<Statistics />} />
              {/* Route imbriquée pour la gestion des cours */}
              <Route path="courses" element={<CoursesContentLayout />}>
                <Route index element={<CoursesList />} />
                <Route path='create' element={<CourseForm />} />
                <Route path=':id/edit' element={<CourseForm />} />
                <Route path=':id' element={<CourseDetails />} />
              </Route>
            
              
              {/* Route imbriquée pour la gestion des comptes */}
              {/* <Route path="accounts" element={<AccountsManagerLayout />}>
                <Route index element={<AccountsManager />} />
                <Route path="autorisations" element={<PermissionManagement />} />
                <Route path="users" element={<AccountsManager />} />
                <Route path="users/:id" element={<DetailsUserCard />} />
                <Route path="agents" element={<AgentsManager />} />
                <Route path="partenaires" element={<Parteners />} />
                <Route path="professionnels" element={<Professionnel />} />
              </Route> */}
              {/* Route imbriquée pour la gestion des comptes */}
              {/* <Route path="students" element={<AccountsManagerLayout />}>
                <Route index element={<AccountsManager />} />
                <Route path="autorisations" element={<PermissionManagement />} />
                <Route path="users" element={<AccountsManager />} />
                <Route path="users/:id" element={<DetailsUserCard />} />
                <Route path="agents" element={<AgentsManager />} />
                <Route path="partenaires" element={<Parteners />} />
                <Route path="professionnels" element={<Professionnel />} />
              </Route> */}

              
              {/* <Route path="*" element={<Page404 />} /> */}
            </Route>

          {/* 404 */}   
          {/* <Route path="*" element={<Page404 />} /> */}
        </Routes>

      {/* </AuthProvider> */}
    </ToastProvider>
  );
};

export default App;