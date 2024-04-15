import { React, useState, useEffect } from "react";

function DynamicTable({ data }) {
  // const [flag, setFlag] = useState(0);
  console.log(data)

  // useEffect(() => {
  //   setFlag(0); // Reset flag when data changes
  // }, [data]);

  return (
<div className="overflow-x-auto min-h-[500px]">
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
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
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
                    {item.attendance[flag].day === i + 1 ? 
                      ( 
                        item.attendance[flag].presentStatus ? '✔️' : '') :
                      ''}

                      {item.attendance[flag].day === i + 1 && item.attendance[flag].presentStatus && (() => { flag++; })()}


                      
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
    </div>
  );
}

export default DynamicTable;
