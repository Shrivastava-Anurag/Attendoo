import { UseDispatch, useDispatch } from 'react-redux';
import { useState, Fragment  } from 'react';
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import server from '../features/server';
import axios from 'axios';
import RequestAdmin from './RequestAdmin';

function RequestPanel() {
    const [open, setOpen] = useState(false)
    const [requests, setRequests] = useState('')

    const getRequests = async() => {
        try {
            const response = await axios.get(`${server}/admin/requests`);
            setRequests(response.data.data);
        } catch(error) {
            console.log(error);
            // Handle the error or rethrow it if necessary
            throw error;
        }
    }
    
    const toggleRequestPanel = () => {
        getRequests();
        setOpen(!open);
    }


  return (
    <>
        <div>
        <button className="text-black bg-amber-50 p-1 fixed rounded-md left-4 top-4" onClick={toggleRequestPanel}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
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
                        <XMarkIcon className="h-6 w-6 bg-black" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-full flex-col overflow-y-scroll bg-amber-50 py-6 shadow-xl">
                    <div className="px-4 sm:px-6 mb-10">
                      <Dialog.Title className="text-base font-bold leading-6 text-gray-900">
                        Requests
                      </Dialog.Title>
                    </div>
                    <div className="relative mt-0 flex-1 px-4 sm:px-2 mr-5 md:mr-0">
                    {
                        requests && 
                        requests.map((request, index) => (
                            <div key={index} className="">
                            { request.status === 'pending' && <RequestAdmin content={request.content} time={request.time} title={request.title} erp={request.erp} name={request.name} date={request.date} status={request.status} from={request.from} to={request.to} requestId={request._id} getRequests={getRequests}/>}
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
        </div>
    </>
  );
}

export default RequestPanel;
