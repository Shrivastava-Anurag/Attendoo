import { useDispatch } from 'react-redux';
import { useSelector } from "react-redux";
import { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useForm, useWatch } from 'react-hook-form';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { Bounce } from 'react-toastify'; // Import the Bounce transition

const Register = () => {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [otherTeam, setOtherTeam] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const teams = useSelector(state => state.teams);

  const Register = async (data) => {
    try {
      console.log(data)

      const registeredResponse = await axios.post("/api/users/register", data, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(registeredResponse)
      if(registeredResponse.status == 200) {
        toast.success('Successfully Registered', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
            });
            reset();
    }
      
      else {
        alert("Response Error");
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  return (
    <>
    <ToastContainer />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-amber-50  ">
            Register Users
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            noValidate
            onSubmit={handleSubmit((data) => {
              Register(data);
            // console.log(data);
            })}
            className="space-y-6"
          >
                      <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-amber-50"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  {...register('name', {
                    required: 'name is required',
                  })}
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-amber-50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
                />
                {errors.name && (
                  <p className="text-amber-600">{errors.name.message}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
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
                  type="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-amber-50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
                />
                {errors.email && (
                  <p className="text-amber-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="erp"
                className="block text-sm font-medium leading-6 text-amber-50"
              >
                ERP Id
              </label>
              <div className="mt-2">
                <input
                  id="erp"
                  {...register('erp', {
                    required: 'erp is required',
                  })}
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-amber-50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
                />
                {errors.erp && (
                  <p className="text-amber-600">{errors.erp.message}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="team"
                className="block text-sm font-medium leading-6 text-amber-50"
              >
                Team
              </label>
              <div className="mt-2">
                <select
                  {...register('team', { required: 'Team is required' })}
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-amber-50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
                >
                  <option value="">Select a team</option>
                  {teams.map((team, index) => (
                    <option key={index} value={team}>{team}</option>
                  ))}
                  <option value="Other">New Team</option>
                </select>
                {errors.team && (
                  <p className="text-amber-600">{errors.team.message}</p>
                )}
              </div>
              {/* Render the input field for other team if selectedTeam is "Other" */}
              {selectedTeam === "Other" && (
                <div className="mt-2">
                  <input
                    {...register("team")}
                    type="text"
                    placeholder="Enter New Team"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-amber-50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
                  />
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="college"
                className="block text-sm font-medium leading-6 text-amber-50"
              >
              College
              </label>
              <div className="mt-2">
                <input
                  id="college"
                  {...register('college', {
                    required: 'college is required',
                  })}
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-amber-50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
                />
                {errors.college && (
                  <p className="text-amber-600">{errors.college.message}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="course"
                className="block text-sm font-medium leading-6 text-amber-50"
              >
                Course
              </label>
              <div className="mt-2">
                <input
                  id="course"
                  {...register('course', {
                    required: 'course is required',
                  })}
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-amber-50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
                />
                {errors.course && (
                  <p className="text-amber-600">{errors.course.message}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="semester"
                className="block text-sm font-medium leading-6 text-amber-50"
              >
                semester
              </label>
              <div className="mt-2">
                <select
                  id="semester"
                  {...register('semester', {
                    required: 'erp is required',
                  })}
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-amber-50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                </select>
                {errors.semester && (
                  <p className="text-amber-600">{errors.semester.message}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="contact"
                className="block text-sm font-medium leading-6 text-amber-50"
              >
                Contact
              </label>
              <div className="mt-2">
                <input
                  id="contact"
                  {...register('contact', {
                    required: 'contact is required',
                  })}
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-amber-50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
                />
                {errors.contact && (
                  <p className="text-amber-600">{errors.contact.message}</p>
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
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  {...register('password', {
                    required: 'password is required',
                    pattern: {
                      value:
                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                      message: `- at least 8 characters\n
                      - must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number\n
                      - Can contain special characters`,
                    },
                  })}
                  type="password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-amber-50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
                />
                {errors.password && (
                  <p className="text-amber-600">{errors.password.message}</p>
                )}

              </div>
              {/* {error && <p className="text-amber-600">{error.message}</p>} */}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-amber-50"
                >
                  Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  {...register('confirmPassword', {
                    required: 'confirm password is required',
                    validate: (value, formValues) =>
                      value === formValues.password || 'password not matching',
                  })}
                  type="password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-amber-50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className=" mt-100 flex w-full justify-center rounded-md bg-amber-50 px-3 py-1.5  text-sm font-semibold leading-6 text-black shadow-sm hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}


export default Register;