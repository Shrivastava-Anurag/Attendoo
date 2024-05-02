import { UseDispatch, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { setLogin } from '../features/userSlice';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import server from '../features/server';

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const[error, setError] = useState("");
  const [userType, setUserType] = useState('student'); // Default to student
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  const Login = async (data) => {
    try {
      if(userType === 'student') {
        const loggedInResponse = await axios.post(`${server}/api/users/login`, data, {
          headers: { 'Content-Type': 'application/json' },
        });
        console.log(loggedInResponse.status)
        if (loggedInResponse.status == 200) {
          const loggedIn = loggedInResponse.data.data;
          console.log(loggedIn)
          dispatch(
            setLogin({
              deviceId: loggedIn.deviceId,
              token: loggedIn.token,
              user: loggedIn,
            })
          );
          navigate('/');
        }
      }
      else {
        const loggedInResponse = await axios.post(`${server}/admin/login`, data, {
          headers: { 'Content-Type': 'application/json' },
        });
        console.log(loggedInResponse.status)
        if (loggedInResponse.status == 200) {
          const loggedIn = loggedInResponse.data.data;
          console.log(loggedIn)
          dispatch(
            setLogin({
              token: loggedIn.token,
              user: loggedIn,
            })
          );
          navigate('/');
        }
      }

    }
    catch (err) {
      if (err.response.status == 401) {
        setError("Invalid Password")
      }
      else if (err.response.status == 404) {
        setError("Email not found")
      }
    }
  }


  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
            className="mx-auto h-40 -z-50 "
            src="/Logo.png"
            alt="Your Company"
          />

          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-amber-50  ">
            Log in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            noValidate
            onSubmit={handleSubmit((data) => {
              Login(data);
            })}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-amber-50"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  {...register('email', {
                    required: 'email is required',
                    pattern: {
                      value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
                      message: 'email not valid',
                    },
                  })}
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-amber-50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-amber-50"
                >
                  Password
                </label>
                <div className="text-sm">
                </div>
              </div>
              <div className="mt-2 relative">
                <input
                  id="password"
                  {...register('password', {
                    required: 'password is required',
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-amber-50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
                />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-2 text-zinc-900"
                  >
                    {showPassword ? <EyeSlashIcon className="h-6 w-6" /> : <EyeIcon className="h-6 w-6" />}
                  </button>
                </div>
                  {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
            </div>

            {/* User type options */}
            <div className="flex items-center justify-center mb-4 text-amber-50">
              <label className="mr-20">
                <input
                  type="radio"
                  value="student"
                  checked={userType === 'student'}
                  onChange={handleUserTypeChange}
                  className="mr-1"
                />
                Student
              </label>
              <label>
                <input
                  type="radio"
                  value="admin"
                  checked={userType === 'admin'}
                  onChange={handleUserTypeChange}
                  className="mr-1"
                />
                Admin
              </label>
            </div>
                  
            <div>
              <button
                type="submit"
                className=" mt-100 flex w-full justify-center rounded-md bg-amber-50 px-3 py-1.5  text-sm font-semibold leading-6 text-black shadow-sm hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Log in
              </button>
            </div>
            <div className='w-full text-center'>
            {error && <p className="text-red-500">{error}</p>}
            </div>
          </form>
        </div>
      </div>

      <div>
      <h2 className='absolute bottom-5 left-5 text-zinc-500'>&copy; Rungta Tech</h2>
        <h2 className='absolute right-10 bottom-5 text-zinc-500'>Version 2.0.0</h2>
      </div>
    </>
  );
}