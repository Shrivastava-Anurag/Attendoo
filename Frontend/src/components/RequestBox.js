import { UseDispatch, useDispatch } from 'react-redux';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


function RequestBox({ isOpen, onClose, onSend, user}) {
    const [request, setRequest] = useState("half-day");
  const [message, setMessage] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  
  const handleRequestChange = (event) => {
    setRequest(event.target.value);
  };

  const sendMessage = () => {

    const data = {
        user: user.userId,
        name: user.name,
        erp: user.erp,
        content: message,
        title: request,
        team: user.team,
        from: startDate,
        to: endDate,
    }
    console.log(data)
    onSend(data);
    setMessage('')
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
                        placeholder="Type your reason here..."
                      ></textarea>
                    </div>
                    <div>
                    </div>
              <label className='mr-10'>
                <input
                  type="radio"
                  value="leave"
                  checked={request === 'leave'}
                  onChange={handleRequestChange}
                  className="mr-1"
                />
                Leave
              </label>
              <label>
                <input
                  type="radio"
                  value="half-day"
                  checked={request === 'half-day'}
                  onChange={handleRequestChange}
                  className="mr-1"
                />
                Half-Day
              </label>


              <div className={`flex flex-col mt-5 ${request === 'leave' ? '' : 'hidden'}`}>
              <h2 className=''>Select Range</h2>
              <div className='flex flex-row'>
      <div>
        <label htmlFor="startDate">From: </label>
        <DatePicker
        showIcon
        selected={startDate}
        onChange={(date) => setStartDate(date)}
          dateFormat="dd/MM/yyyy"
          className='rounded-xl w-3/4 shadow-md'
        />
      </div>
      <div>
        <label htmlFor="endDate">To: </label>
        <DatePicker
        showIcon
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="dd/MM/yyyy"
          className='rounded-xl w-3/4 shadow-md'
        />
      </div>
    </div>
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

export default RequestBox;
