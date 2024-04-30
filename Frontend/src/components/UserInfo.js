import React, { useState } from 'react';

const UserInfo = ({ user, onClose, onDelete, onUpdate }) => {
  const [updatedUser, setUpdatedUser] = useState({ ...user });
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = () => {
    onUpdate(updatedUser);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(user._id);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };



  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-zinc-800 px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-white">User Details</h3>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <p>Name: {user.name}</p>
            <p>ERP: {user.erp}</p>
            <p>Email: {user.email}</p>
            <p>Team: {user.team}</p>
          </div>
          {isEditing ? (
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Update User</h3>
              <input
                type="text"
                name="name"
                value={updatedUser.name}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-200"
              />
              <input
                type="text"
                name="erp"
                value={updatedUser.erp}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-200"
              />
              <input
                type="text"
                name="email"
                value={updatedUser.email}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-200"
              />
              <input
                type="text"
                name="team"
                value={updatedUser.team}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
          ) : null}
          <div className="bg-gray-200 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {isEditing ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-amber-500 text-base font-medium text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="mt-3 ml-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </>
            ) : (
                <div>
                <button onClick={handleDelete} className=" absolute mt-3 left-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Delete
            </button>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-3 ml-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-amber-500 text-base font-medium text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Edit
              </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
);
};


export default UserInfo;
