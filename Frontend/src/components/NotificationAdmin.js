import { UseDispatch, useDispatch } from 'react-redux';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import axios from 'axios';

// export default function MessageAdmin() {
// const [selectedTeam, setteam] = useState("All");
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const Register = async (data) => {
//     try {
//       const loggedInResponse = await axios.post("http://localhost:8080/api/users/register", data, {
//         headers: { 'Content-Type': 'application/json' },
//       });
//       console.log(loggedInResponse)
//       if (loggedInResponse.status == 200) {
//         const loggedIn = loggedInResponse.data.data;
//         console.log(loggedIn)
//         navigate('/login');
//       }
//       else {
//         alert("Kuch toh bura hua hai")
//       }
//     }
//     catch (err) {
//       console.log(err);
//     }
//   }


//   return (
//     <>
//       <div className="flex  flex-1 flex-col justify-center px-6 py-12 lg:px-10 mx-96  bg-zinc-900 rounded-3xl">
//         <div className="">
//           <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-amber-50  ">
//             Send Message
//           </h2>
//         </div>

//         <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
//           <form
//             noValidate
//             onSubmit={handleSubmit((data) => {
//               Register(data);
//             // console.log(data);
//             })}
//             className="space-y-6"
//           >

//             <div>
//               <label
//                 htmlFor="team"
//                 className="block text-sm font-medium leading-6 text-amber-50"
//               >
//                 Team
//               </label>
//               <div className="mt-2">
//                 <input
//                   id="team"
//                   {...register('team', {
//                     required: 'Team is required',
//                   })}
//                   type="text"
//                   className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-amber-50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
//                 />
//                 {errors.team && (
//                   <p className="text-amber-600">{errors.team.message}</p>
//                 )}
//               </div>
//             </div>

//             <div>
//               <div className="flex items-center justify-between">
//                 <label
//                   htmlFor="text"
//                   className="block text-sm font-medium leading-6 text-amber-50"
//                 >
//                   Message
//                 </label>
//               </div>
//               <div className="mt-2">
//                 <textarea
//                   id="message"
//                   {...register('message', {
//                     required: 'meesage is required',
//                     pattern: {
//                         value:
//                         /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
//                         message: `- At least 8 characters\n
//                         - Must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number\n
//                         - Can contain special characters`,
//                     },
//                   })}
//                   type="text"
//                   className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-amber-50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
//                 />
//                 {errors.password && (
//                   <p className="text-amber-600">{errors.message.message}</p>
//                 )}

//               </div>
//               <div className='mt-7'>
//               <label
//                   htmlFor="text"
//                   className="block text-sm font-medium leading-6 text-amber-50"
//                 >
//                   Select Team
//                 </label>
//               <select
//                 value={selectedTeam}
//                 onChange={(event) => {
//                   setteam(event.target.value);
//                 }}
//                 className="block mt-2 appearance-none w-full border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:ring focus:ring-gray-700"
//               >
//                 <option value="">All</option>
//                 <option value="RungtaTech">RungtaTech</option>
//                 <option value="Fake">Fake</option>
//                 <option value="option3">Option 3</option>
//               </select>
//               </div>


//               {/* {error && <p className="text-amber-600">{error.message}</p>} */}
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 className=" mt-100 flex w-full justify-center rounded-md bg-amber-50 px-3 py-1.5  text-sm font-semibold leading-6 text-black shadow-sm hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//               >
//                 Send
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }


function MessageAdmin({ isOpen, onClose, onSend, teams }) {
    const [selectedTeam, setTeam] = useState("All");
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    const data = {
        team : selectedTeam,
        message : message
    }
    console.log(data)
    onSend(data);
    setMessage('')
    setTeam("All")
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-zinc-900 sm:mx-0 sm:h-10 sm:w-10">
                    📩
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium text-gray-900" id="modal-title">
                      Send Message
                    </h3>
                    <div className="mt-2">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-80 h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Type your message here..."
                      ></textarea>
                    </div>
                    <div>
                    <label
                  htmlFor="text"
                  className="block text-sm font-medium leading-6 text-black"
                >
                  Select Team
                </label>
                <select
                    value={selectedTeam}
                    onChange={(event) => {
                    setTeam(event.target.value);
                    }}
                    className="block mt-2 appearance-none w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                >
                    <option value="all">All</option>
                    {teams.map((team, index) => (
                      <option value={team}>{team}</option>
                    ))}
                    </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button onClick={sendMessage} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-amber-500 text-base font-medium text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:ml-3 sm:w-auto sm:text-sm">
                  Send
                </button>
                <button onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MessageAdmin;
