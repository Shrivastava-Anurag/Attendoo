import { useEffect, useState, Fragment } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import { Bounce } from 'react-toastify'; // Import the Bounce transition
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import Notification from "./Notifications";
import { useNavigate } from 'react-router-dom';
export default function Home() {

    const [getIP, setIP] = useState();
    const [longitude, setLongitude] = useState();
    const [latitude, setLatitude] = useState();
    const [disabled, setDisabled] = useState(true);
    const [announcements, setAnnouncements] = useState();
    const token = useSelector(state => state.token);
    const deviceId = useSelector(state => state.deviceId);
    const user = useSelector(state => state.user);
    const selectedTeam = useSelector(state => state.user.team);
    const [open, setOpen] = useState(false)
    const navigate = useNavigate();

    const togglePanel = () => {
      setOpen(!open);
    };

    const getAnnouncements = async() => {
        try {
            const team = selectedTeam;
            const response = await axios.get(`/admin/announcements/${team}`);
            await setAnnouncements(response.data.data);
        } catch(error) {
            console.log(error);
            // Handle the error or rethrow it if necessary
            throw error;
        }
    }

    const verifyToken = async() => {
        try {
            const response = await axios.post(
                '/api/users/verify-token',
                {}, // Empty object or request data if needed
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                    'X-deviceId': deviceId,
                  },
                }
              );
            // console.log(response.status)

        } catch(error) {
            if(error.response.status == 401) {
                toast.error('Relogin')
                navigate('/login');
            }
            // Handle the error or rethrow it if necessary
            // throw error;
        }
    }


    const verify = async () => {
        console.log()
        await fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
          const ipAddress = data.ip;
          setIP(ipAddress);
        })
        .catch(error => {
            toast.error('Check your network connection and try again');
        });

            // Check if Geolocation is supported
        if ('geolocation' in navigator) {
            // Get current position
            navigator.geolocation.getCurrentPosition(
            // Success callback
            function(position) {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
            
            },
            // Error callback
            function(error) {
                console.error('Error getting current position:', error.message);
                toast.error('Please enable the browser to access current location')
            }
            );
        } else {
            alert('The browser does not support location ');
        }
    }

    useEffect(() => {
        verify();
        if (getIP || latitude || longitude) {setDisabled(false)}

        getAnnouncements();
        verifyToken();
        console.log(announcements)
    },[latitude, longitude]);

    
    
    const checkOut = async() => {
        const data = {
            latitude: latitude,
            longitude: longitude,
            ip: getIP,
        }
        console.log(data)

        console.log(data);
        try {
            const response = await axios.post("/api/users/punch-out",  {
                latitude: latitude,
                longitude: longitude,
                ip: getIP,
        }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                    'X-deviceId': deviceId,
                },
              });
            if(response.status == 200) {
                console.log(response.data);
                toast.success('Check Out Successful', {
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

                    toast.success(`Total working hours ${response.data.data.totalWorkingHours} ${response.data.data.totalWorkingHours.includes("8h") ? 'Workaholic :)' : 'Too soon Lazy Fellow :('}`, {
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
            }
            else {
                console.log("error")
            }
        }
        catch (error) {
            if(error.response.status == 400) {
                console.log(error.response.data.message);
                toast.error('You can Check In only once');
            }
            else if(error.response.status == 'Unauthorized') {
                // toast.error('Relogin')
                navigate('/login');
            }
            else if(error.response.status == 401) {
                toast.error('Invalid IP address')
            }
            else if(error.response.status == 403) {
                toast.error('Location outside allowed range')
            }
            else{
                console.error(error.response)
            }
        }

    }

    const checkIn = async() => {
        try {
            const response = await axios.post("/api/users/punch-in",  {
                latitude: latitude,
                longitude: longitude,
                ip: getIP,
        }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                    'X-deviceId': deviceId,
                },
              });
            if(response.status == 200) {
                console.log(response.data.data);
                toast.success('Check In Successful', {
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

            }
            else {
                console.log("error")
            }
        }
        catch (error) {
            if(error.response.status == 400) {
                console.log(error.response.data.message);
                toast.error('You can Check In only once');
            }
            else if(error.response.status == 'Unauthorized') {
                // toast.error('Relogin')
                navigate('/login');
            }
            else if(error.response.status == 401) {
                toast.error('Invalid IP address')
            }
            else if(error.response.status == 403) {
                toast.error('Location outside allowed range')
            }
            else{
                console.error(error.response)
            }
            
        }

    }

    return(
        <>
        <ToastContainer />
        <button className="text-white fixed right-7 top-5" onClick={togglePanel}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
        <path fillRule="evenodd" d="M12 2.25c-2.429 0-4.817.178-7.152.521C2.87 3.061 1.5 4.795 1.5 6.741v6.018c0 1.946 1.37 3.68 3.348 3.97.877.129 1.761.234 2.652.316V21a.75.75 0 0 0 1.28.53l4.184-4.183a.39.39 0 0 1 .266-.112c2.006-.05 3.982-.22 5.922-.506 1.978-.29 3.348-2.023 3.348-3.97V6.741c0-1.947-1.37-3.68-3.348-3.97A49.145 49.145 0 0 0 12 2.25ZM8.25 8.625a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Zm2.625 1.125a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clipRule="evenodd" />
        </svg>

        </button>

        <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-0"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-0"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-0"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-0"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setOpen(false)}
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-full flex-col overflow-y-scroll bg-amber-50 py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <Dialog.Title className="text-base font-bold leading-6 text-gray-900">
                        Announcements For You
                      </Dialog.Title>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-2 mr-5 md:mr-0">
                    {
                        announcements && 
                        announcements.map((announcement, index) => (
                            <div key={index} className="mb-5">
                            <Notification content={announcement.content} time={announcement.date}/>
                            </div>
                        ))
                    }
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>

    <div className="flex flex-col bg-amber-50 w-[350px] h-[400px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-3xl hover:drop-shadow-2xl font-mono outline outline-2 outline-amber-50 hover:outline-offset-8 transition-all duration-300">
    <div className="flex flex-col flex-wrap justify-center">
        <h1 className="text-3xl mt-20 mb-10 px-5 font-bold font-mono self-center">
            {user.name}
        </h1>
        <div className="flex flex-row justify-center">
            <div className="flex flex-col mx-5 justify-center text-xl font-semibold font-mono">
                <h1>ERP :</h1>
                <h1>{user.erp}</h1>
            </div>
            <div className="flex flex-col mx-5 justify-center text-xl font-semibold">
                <h1>Team :</h1>
                <h1>{user.team}</h1>
            </div>
        </div>
    </div>
    <div className="flex flex-row mt-20 justify-center">
        <button onClick={checkIn} disabled={disabled} className="bg-slate-950 text-amber-50 border border-slate-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
            <span className="bg-slate-400 shadow-amber-50 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
            CHECK IN
        </button>

        <button onClick={checkOut} disabled={disabled} className="bg-slate-950 text-amber-50 border border-slate-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group ml-5">
            <span className="bg-slate-400 shadow-amber-50 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
            CHECK OUT
        </button>
    </div>
</div>

        </>
    )
}


