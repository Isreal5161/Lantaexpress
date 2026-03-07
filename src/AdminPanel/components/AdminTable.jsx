import React from "react";

export default function AdminTable({ columns, data }) {
  return (
    <div className="bg-white border rounded-lg shadow-sm w-full overflow-hidden">

      <table className="w-full text-xs sm:text-sm">

        {/* HEADER */}
        <thead className="bg-gray-50 border-b text-left text-slate-600">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className="px-2 sm:px-4 py-2 sm:py-3 font-semibold break-words"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b hover:bg-gray-50 transition"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-2 sm:px-4 py-2 sm:py-3 text-slate-700 break-words"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}