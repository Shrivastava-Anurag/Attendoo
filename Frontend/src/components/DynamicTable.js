import { React, useState, useEffect } from "react";
import UserInfo from "./UserInfo";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Bounce } from 'react-toastify'; // Import the Bounce transition
import server from '../features/server';

function DynamicTable({ data }) {
  // const [flag, setFlag] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleClosePopup = () => {
    setSelectedUser(null);
  };

  const handleDeleteUser = async (userId) => {
    try {
      console.log(userId)
      const response = await axios.delete(`${server}/admin/users/${userId}`)
      if(response.status == 200) {
        toast.success('Successfully Deleted', {
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
            setSelectedUser(null);
            window.location.reload();
    }
      
    }
    catch(error){
      console.log(error)
    }
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      const userId = updatedUser._id
      const response = await axios.put(`${server}/admin/users/${userId}`, updatedUser, {
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
            setSelectedUser(null);
            window.location.reload();
    }
      
    }
    catch(error){
      console.log(error)
    }
  };


  useEffect(() => {
  }, [data]);

  return (
<div className="overflow-x-auto min-h-[500px]">
      <ToastContainer />
      <table className="min-w-full divide-y divide-gray-200 ">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="select-none px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              scope="col"
              className="select-none px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Team
            </th>
            {
              Array.from({ length: 31 }, (_, index) => (
                <th
                  key={index}
                  scope="col"
                  className=" select-none px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {index + 1}
                </th>
              ))
            }
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
        {data.map((item, index) => {
          let flag = 0;
          return (
          <tr key={item.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer" onClick={() => handleUserClick(item)}>{item.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.team}</td>
            {
              item.attendance.length > flag ? 
                Array.from({ length: item.attendance[item.attendance.length-1].day }).map((_, i) => {
                  
                  return (
                  <td
                    key={i}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                  
                  {/* {console.log(i + " " + flag)} */}
                  {/* {item.attendance[flag].day === i + 1 && item.attendance[flag].presentStatus && console.log(flag)} */}
                  {/* {item.attendance[flag].day === i + 1 && item.attendance[flag].presentStatus && flag++ console.log(flag)} */}
                  {
                    item.attendance[flag].day === i + 1 ? 
                    ( 
                      item.attendance[flag].status === 'present' ? '✔️✔️' :
                      item.attendance[flag].status === 'half-day' ? '✔️' :
                      item.attendance[flag].status === 'leave' ? 'L' :
                      item.attendance[flag].status === 'absent' ? '' :
                      ''
                    ) :
                    ''
                  }
                      

                      {item.attendance[flag].day === i + 1 && (() => { flag++; })()}


                      
                      {/* {item.attendance[flag].day === i + 1 && item.attendance[flag].presentStatus && console.log("flag incremented: ")} */}
                      {/* {console.log()} */}
                  </td>
                  )
            })
                : null
            }
          </tr>
          )
        })}
        </tbody>
      </table>
      {selectedUser && (
        <UserInfo
          user={selectedUser}
          onClose={handleClosePopup}
          onDelete={handleDeleteUser}
          onUpdate={handleUpdateUser}
        />
      )}
    </div>
  );
}

export default DynamicTable;
