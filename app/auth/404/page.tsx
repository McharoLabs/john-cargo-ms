import React from "react";

const Notfound = () => {
  return (
    <div className="bg-gray-900 h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-yellow-500">404 | Not Found</h1>
        <p className="mt-4 text-white text-lg">
          The page you are looking for does not exist.
        </p>
      </div>
    </div>
  );
};

export default Notfound;
