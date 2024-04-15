import React from 'react';

const Notification = ({ content, time }) => {
  return (
    <div className="w-full rounded-xl px-2 py-5 flex bg-amber-200 overflow-hidden">
      <div>
        <h1 className="text-md font-bold mb-4 mx-2">{content}</h1>
        <p className="ml-[310px] text-gray-500">{time}</p>
      </div>
    </div>
  );
};

export default Notification;