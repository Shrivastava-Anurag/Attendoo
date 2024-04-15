import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import DynamicTable from '../components/DynamicTable'
import DataTable from 'react-data-table-component';
import { useDispatch, } from 'react-redux'
import { setLogout } from '../features/userSlice';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { setTeamNames } from '../features/userSlice';
import MessageAdmin from '../components/NotificationAdmin';

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}



export default function Dashboard() {
  const [selectedTeam, setteam] = useState("all");
  const [students, setStudents] = useState();
  const [teams, setTeams] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async(data) => {
    try {
      const response = await axios.post("/admin/announcement", data, {
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
      const team = selectedTeam == 'all' ? '' : selectedTeam;
      const response = await axios.get(`/admin/users/${team}`)
        return response.data.data;
    }
    catch(error){
      console.log(error)
    }
  }

  const fetchTeams = async() => {
    try {
      const response = await axios.get('/admin/teams')
        return response.data.data;
    }
    catch(error){
      console.log(error)
    }
  }

  const downloadAttendance = async() => {
    try {
      const response = await axios.get('/admin/download-attendance', {
        responseType: 'blob', // Set the responseType to 'blob' to handle binary data
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'attendance.xlsx'); // Specify the filename
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading attendance:', error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const studentsData = await fetchStudents();
      const teamData = await fetchTeams();
      setTeams(teamData);
      dispatch(setTeamNames(teamData));
      setStudents(studentsData); // Set the state with the fetched data
    };
  
    fetchData();
  }, [selectedTeam]);

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
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
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
                      </div>

                      <div className='hidden md:flex flex-row'>
                      <select
                value={selectedTeam}
                onChange={(event) => {
                  setteam(event.target.value);
                }}
                className="block appearance-none bg-amber-50 border border-gray-300 hover:border-gray-400 px-4 py-1 pr-8 rounded shadow leading-tight focus:outline-none focus:ring focus:ring-gray-700"
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

        <header className="bg-white shadow">
          <div className=" mx-10 py-10 max-w-7xl ">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Attendance</h1>
          </div>
        </header>
        <main className='bg-white'>
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


    </>
  )
}