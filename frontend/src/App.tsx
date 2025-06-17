import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <div>
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
            <Route path='/users/dashboard' element={<UserDashboard />} />
            <Route path='/users/tasks' element={<MyTask />} />
            <Route path='/users/tasks/:id' element={<TaskDetails />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
