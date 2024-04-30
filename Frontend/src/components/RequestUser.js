import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, React } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { Bounce } from 'react-toastify'; // Import the Bounce transition
import axios from 'axios';
import server from '../features/server';

const RequestUser = ({ content, time, title, name, erp, status, date, from, to, requestId }) => {
    let [isOpen, setIsOpen] = useState(false)
    const[message, setMessage] = useState('');
    const [requestStatus, setRequestStatus] = useState("");
    function closeModal() {
        setIsOpen(false)
      }
    
      function openModal() {
        setIsOpen(true)
      }

  return (
    <>
    <div className="w-full px-4 ">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-amber-50 p-2">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
              <h1  className='text-md font-bold mb-1 mx-2'>{title.toUpperCase()} REQUEST</h1>
                <ChevronUpIcon
                  className={`${
                    open ? '' : 'rotate-180 transform'
                  } h-5 w-5 text-purple-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm">
              <div className="w-full rounded-xl px-2 py-5 flex flex-col bg-amber-200 overflow-hidden">
                
                <div className='flex flex-row px-2 relative'>
                    <h3 className='font-semibold'>{name}</h3>   
                    <h3 className={`font-semibold text-sm absolute right-5 ${status === 'approved' ? 'bg-green-500' : status === 'rejected' ? 'bg-red-500' : 'bg-amber-500' } p-2 px-5 rounded-xl`}>{status.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h3>
                </div>
                <h3 className=' px-2 font-semibold'>{erp}</h3>
                <div className='mt-4'>
                    <h1 className="text-md mb-4 mx-2">{content}</h1>
                </div>
                <div className='flex flex-row px-3 pb-4 relative'>
                <p className=" text-gray-700">{date}</p>
                <p className="absolute right-7 text-gray-700">{time}</p>
                </div>
                {
                    title === 'leave' && (
                        <div className='flex flex-row px-3 pb-4 relative'>
                        <p className=" text-gray-700">From: {from}</p>
                        <p className="absolute right-7 text-gray-700">To: {to}</p>
                        </div>
                    )
                }

                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>

    
</>
  );
};

export default RequestUser;