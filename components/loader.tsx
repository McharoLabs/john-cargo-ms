import React from "react";

const Loader = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center justify-center">
      <svg
        className="w-5 h-5 mr-2 text-white animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        ></path>
      </svg>
      {message}
    </div>
  );
};

export default Loader;
