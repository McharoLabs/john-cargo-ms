const Unauthorized = async () => {
  return (
    <div className="bg-gray-900 h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500">401 | Unauthorized</h1>
        <p className="mt-4 text-white text-lg">
          You do not have permission to access this page.
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
