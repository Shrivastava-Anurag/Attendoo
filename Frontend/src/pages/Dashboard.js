import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition, Listbox } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import DynamicTable from '../components/DynamicTable'
import DataTable from 'react-data-table-component';
import { useDispatch, } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { setLogout } from '../features/userSlice';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { setTeamNames } from '../features/userSlice';
import MessageAdmin from '../components/NotificationAdmin';
import server from '../features/server';
import RequestPanel from '../components/RequestPanel';

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const months = [
  {id: 1, name: 'Janurary'},
  {id: 2, name: 'February'},
  {id: 3, name: 'March'},
  {id: 4, name: 'April'},
  {id: 5, name: 'May'},
  {id: 6, name: 'June'},
  {id: 7, name: 'July'},
  {id: 8, name: 'August'},
  {id: 9, name: 'September'},
  {id: 10, name: 'October'},
  {id: 11, name: 'November'},
  {id: 12, name: 'December'}
];


export default function Dashboard() {
  const [selectedTeam, setteam] = useState("all");
  const [students, setStudents] = useState();
  const [teams, setTeams] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [presentType, setPresentType] = useState('all'); // Default to student
  const [open, setOpen] = useState(false)
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const [selectedMonth, setselectedMonth] = useState(currentMonth)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };


  const togglePanel = () => {
    setOpen(!open);
  };

  const handlePresentTypeChange = (event) => {
    setPresentType(event.target.value);
  };

  const signOut = () => {
    dispatch(
      setLogout()
    )
    navigate('/login');
  }

  const handleSend = async(data) => {
    try {
      const response = await axios.post(`${server}/admin/announcement`, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(response)
      if (response.status == 200) {
        const responseData = response.data.data;
        console.log(responseData)
      }
      else {
        alert("Something went wrong")
      }
    }
    catch (err) {
      console.log(err);
    }
  };


  const fetchStudents = async() => {
    try {
      const team = selectedTeam;
      let response;
      console.log(typeof selectedMonth)
      if(presentType === 'all') {
        response = await axios.get(`${server}/admin/users/${team}/${selectedMonth}/2024/?present=${presentType}`)
      }
      else {
        response = await axios.get(`${server}/admin/teams/${team}/${selectedMonth}/2024/?present=${presentType}`)
      }
      return response.data.data;
    }
    catch(error){
      console.log(error)
    }
  }

  const fetchTeams = async() => {
    try {
      const response = await axios.get(`${server}/admin/teams`)
        return response.data.data;
    }
    catch(error){
      console.log(error)
    }
  }

  const downloadAttendance = async() => {
    try {
      const response = await axios.get(`${server}/admin/download-attendance`, {
        responseType: 'blob', // Set the responseType to 'blob' to handle binary data
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      link.setAttribute('download', `attendance${day}${month}${year}.xlsx`); // Specify the filename
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading attendance:', error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [studentsData, teamData] = await Promise.all([fetchStudents(), fetchTeams()]);
      setTeams(teamData);
      dispatch(setTeamNames(teamData));
      setStudents(studentsData);
      setIsLoading(false);
    };

    fetchData();
  }, [selectedTeam, presentType, selectedMonth]);

  const columns = [
    {
      name: 'Name',
      selector: row => row.name,
    },
    {
      name: 'Team',
      selector: row => row.team,
    },
  ];

  for (let i = 1; i <= 31; i++) {
    columns.push({
      name: String(i),
      selector: row => row.attendance[0] // Assuming the data has properties like day1, day2, ..., day31
    });
  }
  
const data = [];
if(students){
  students.map((item, index) => {
    data.push(item)
    // console.log(item.attendance[0].presentStatus)
})
}


  return (
    <>
        <>
      {isLoading ? ( // Conditional rendering based on isLoading state
        <div className="min-h-screen flex justify-center items-center">
          <p className="text-2xl text-amber-50 font-semibold">Loading...</p>
        </div>
      ) : (
        <div className="min-h-full">
        <Disclosure as="nav" className="bg-zinc-900">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href} className={classNames(
                              item.current
                                ? 'bg-amber-50 text-black'
                                : 'text-white hover:bg-amber-50 hover:text-black',
                              'rounded-md px-3 py-2 text-sm font-medium'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div> 
                      </div>
                      <button className="hidden md:block w-full mb-2 mt-2 bg-amber-50 rounded ml-5 p-1 hover:bg-amber-100" onClick={downloadAttendance}>Download Attendance</button>
                      </div>

                      <div className='hidden md:flex flex-row'>
                      <select
                value={selectedTeam}
                onChange={(event) => {
                  setteam(event.target.value);
                }}
                className="block appearance-none w-[150px] bg-amber-50 border border-gray-300 hover:border-gray-400 px-4 py-1 pr-8 rounded shadow leading-tight focus:outline-none focus:ring focus:ring-gray-700"
              >
                <option value="all">All</option>
                {
                  teams.map((team, index) => (
                    <option key={index} value={team}>{team}</option>
                  ))
                }
              </select>    
                    <button className="bg-amber-50 rounded ml-5 p-1 hover:bg-amber-100" onClick={togglePopup}>Send Announcement</button>
              <button className="bg-amber-50 rounded ml-5 p-1 hover:bg-amber-100">
                <Link to="/register">Add Member</Link>
              </button>
              <button className="bg-amber-50 rounded ml-5 p-1 hover:bg-amber-100">
                <Link to="/admin-register">Add Admin</Link>
              </button>
              <button onClick={() => signOut()} className="bg-red-600  rounded ml-5 p-1 hover:bg-red-500 px-2 ">
                Sign Out
              </button>
                      </div>

                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'block rounded-md px-3 py-2 text-base font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                  <div className='flex-flex-col pr-10'>
                  <button className="w-full mb-2 bg-amber-50 rounded ml-5 p-1 hover:bg-amber-100" onClick={downloadAttendance}>Download Attendance</button>
                  <button className="w-full mb-2 bg-amber-50 rounded ml-5 p-1 hover:bg-amber-100" onClick={togglePopup}>Send Announcement</button>
                <button className="w-full mb-2 bg-amber-50 rounded ml-5 p-1 hover:bg-amber-100">
                <Link to="/register">Add Member</Link>
              </button>
              <button className="w-full mb-2 bg-amber-50 rounded ml-5 p-1 hover:bg-amber-100">
                <Link to="/admin-register">Add Admin</Link>
              </button>
              <select
                value={selectedTeam}
                onChange={(event) => {
                  setteam(event.target.value);
                }}
                className="block w-full text-center mb-2 sef appearance-none bg-amber-50 border border-gray-300 hover:border-gray-400 ml-5 px-4 py-1 pr-8 rounded shadow leading-tight focus:outline-none focus:ring focus:ring-gray-700"
              >
                <option value="all">All</option>
                {
                  teams.map((team, index) => (
                    <option key={index} value={team}>{team}</option>
                  ))
                }
              </select> 
                  </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <div>
          <RequestPanel/>
        </div>

        <header className="bg-white shadow">
          <div className=" mx-10 py-10 max-w-7xl ">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Attendance</h1>
            <div className="flex items-center justify-center mb-4 text-zinc-900">
              <label className="mr-10">
                <input
                  type="radio"
                  value="all"
                  checked={presentType === 'all'}
                  onChange={handlePresentTypeChange}
                  className="mr-1"
                />
                All
              </label>
              <label className='mr-10'>
                <input
                  type="radio"
                  value="present"
                  checked={presentType === 'present'}
                  onChange={handlePresentTypeChange}
                  className="mr-1"
                />
                Present
              </label>
              <label>
                <input
                  type="radio"
                  value="absent"
                  checked={presentType === 'absent'}
                  onChange={handlePresentTypeChange}
                  className="mr-1"
                />
                Absent
              </label>
              <select
                value={selectedMonth}
                onChange={(event) => {
                  setselectedMonth(parseInt(event.target.value));
                }}
                className="block text-center mb-2 sef appearance-none bg-amber-50 border border-gray-300 hover:border-gray-400 ml-5 px-4 py-1 pr-8 rounded shadow leading-tight focus:outline-none focus:ring focus:ring-gray-700"
              >
                {
                  months.map((month, index) => (
                    <option key={month.id} value={month.id}>{month.name}</option>
                  ))
                }
              </select> 

            </div>
          </div>
        </header>
        <main className='bg-white '>
          <div className="mx-10 ">
          {/* <DataTable
			columns={columns}
			data={data}
		/> */}
    <DynamicTable data={data}/>
    <MessageAdmin isOpen={isOpen} onClose={togglePopup} onSend={handleSend} teams={teams} />
          </div>
        </main>
      </div>
      )}
    </>

    </>
  )
}