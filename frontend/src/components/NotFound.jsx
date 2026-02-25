
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  text-white">
      <div className="bg-gray-700 rounded-full p-6 mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="16" r="1" fill="currentColor" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold mb-2 text-black">Page isn't available</h1>
      <p className="text-black text-sm mb-6">
        404 - Page Not Found.
      </p>

      <Button
        onClick={() => navigate("/")}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-6 rounded-full transition duration-200 cursor-pointer"
      >
        Go back Home
      </Button>
    </div>
  );
};

export default NotFound