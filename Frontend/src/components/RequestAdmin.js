import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, React } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { Bounce } from 'react-toastify'; // Import the Bounce transition
import axios from 'axios';
import server from '../features/server';

const RequestAdmin = ({ content, time, title, name, erp, status, date, from, to, requestId, getRequests }) => {
    let [isOpen, setIsOpen] = useState(false)
    const[message, setMessage] = useState('');
    const [requestStatus, setRequestStatus] = useState("");
    function closeModal() {
        setIsOpen(false)
        handleSendRequest(requestId);
      }
    
      function openModal() {
        setIsOpen(true)
      }

      function handleApproved() {
        setRequestStatus('approved')
        openModal();
      }

      function handleRejected() {
        setRequestStatus('rejected')
        openModal();
      }

      const handleSendRequest = async(requestId) => {
            try {
              const updatedRequest = {
                comment: message,
                status: requestStatus,
              }
              const response = await axios.put(`${server}/admin/request/${requestId}`, updatedRequest, {
                headers: { 'Content-Type': 'application/json' },
              });
              if(response.status == 200) {
                toast.success('Successfully Updated', {
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
            getRequests();
              
            }
            catch(error){
              console.log(error)
            }
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
                    <h3 className='font-semibold text-sm absolute right-5 bg-amber-500 p-2 px-5 rounded-xl'>{status.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h3>
                </div>
                <h3 className=' px-2 font-semibold'>{erp}</h3>
                <div className='mt-4'>
                    <h1 className="text-md mb-4 mx-2">{content}</h1>
                </div>
                <div className='flex flex-row px-3 pb-4 relative'>
                <p className=" text-gray-700">{date}</p>
                <p className="absolute right-7 text-gray-700">{time}</p>
                </div>
                <div className='flex flex-row px-3 pb-4 relative'>
                <p className=" text-gray-700">From: {from}</p>
                <p className="absolute right-7 text-gray-700">To: {to}</p>
                </div>
                <div className='flex flex-row px-20 pb-4 justify-between'>
                    <button className='bg-green-500 hover:bg-green-600 py-2 px-4 rounded-md font-semibold' onClick={handleApproved}>Approve</button>
                    <button className='bg-red-500 hover:bg-red-600 py-2 px-4 rounded-md font-semibold' onClick={handleRejected}>Reject</button>
                </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Comment
                  </Dialog.Title>
                  <div className="mt-2">
                  <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className={`w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 ${requestStatus === 'approved' ? 'focus:ring-green-500' : 'focus:ring-red-500'} ${requestStatus === 'approved' ? 'focus:border-green-500' : 'focus:border-red-500'}`}
                        placeholder="Type your message here..."
                      ></textarea>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className={`inline-flex justify-center rounded-md border border-transparent ${requestStatus === 'approved' ? 'bg-green-400' : 'bg-red-400'} px-4 py-2 text-sm font-medium text-zinc-900 hover:${requestStatus === 'approved' ? 'bg-green-600' : 'bg-red-600'} focus:outline-none focus-visible:ring-2 focus-visible:${requestStatus === 'approved' ? 'ring-green-400' : 'ring-red-400'} focus-visible:ring-offset-2`}
                      onClick={closeModal}
                    >
                      {requestStatus === 'approved' ? 'Approve' : 'Reject'}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    
</>
  );
};

export default RequestAdmin;