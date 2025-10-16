import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from 'react-router-dom';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import PrivateRoute from './routes/PrivateRoute';

import Dashboard from './pages/Admin/Dashboard';
import ManageTask from './pages/Admin/ManageTask';
import CreateTask from './pages/Admin/CreateTask';
import ManageUsers from './pages/Admin/ManageUsers';

import UserDashboard from './pages/User/UserDashboard';
import MyTask from './pages/User/MyTask';
import TaskDetails from './pages/User/TaskDetails';

import { Toaster } from 'react-hot-toast';
import AuthProvider, { useAuth } from './context/auth.context';

function App() {
  return (
    <div>
      <AuthProvider>
        <Toaster />
        <Router>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />

            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={['admin']} />}>
              <Route path='/admin/dashboard' element={<Dashboard />} />
              <Route path='/admin/tasks' element={<ManageTask />} />
              <Route path='/admin/create-task' element={<CreateTask />} />
              <Route path='/admin/users' element={<ManageUsers />} />
            </Route>

            {/* User Routes */}
            <Route element={<PrivateRoute allowedRoles={['user']} />}>
              <Route path='/user/dashboard' element={<UserDashboard />} />
              <Route path='/user/tasks' element={<MyTask />} />
              <Route path='/user/tasks/:id' element={<TaskDetails />} />
            </Route>

            <Route path='/' element={<Root />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;

const Root = () => {
  const { user, loading } = useAuth();

  if (loading) return <Outlet />;
  if (!user) return <Navigate to='/login' />;

  return user?.role === 'admin' ? (
    <Navigate to='/admin/dashboard' />
  ) : (
    <Navigate to='/user/dashboard' />
  );
};
