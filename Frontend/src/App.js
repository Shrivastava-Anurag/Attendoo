import logo from './logo.svg';
import './App.css';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/Register';
import AdminRegisterPage from './pages/adminRegister';
import { BrowserRouter, Navigate, Routes, Route} from "react-router-dom";
import {useSelector} from 'react-redux'


function App() {
  const isAuth = Boolean(useSelector((state) => state.token));
  const isAdmin = Boolean(useSelector((state) => state.user && state.user.role === 'admin'));
  // const isAuth = true;
  return (
    <>
    <BrowserRouter>
    <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={isAdmin ? <RegisterPage /> : <Navigate to="/" />} />
            {isAdmin ? (<Route path="/" element={ <Dashboard /> } />) : (<Route path="/" element={ isAuth ? <HomePage /> : <Navigate to="/login" />} />)}

            {/* <Route path="/dashboard" element={isAdmin ? <Dashboard /> : <Navigate to="/" />} /> */}
            <Route path="/admin-register" element={isAdmin ? <AdminRegisterPage /> : <Navigate to="/" />} />
          </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
