import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import mainLogo from "../assets/app-logo/mainlogo.svg";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <img
            src={mainLogo}
            alt="Marqait"
            className="mx-auto h-12 mb-8 opacity-80"
          />
          <h1 className="text-8xl md:text-9xl font-bold mb-6 gradient-text">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-200">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="cursor-pointer bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0 px-8 py-3 text-lg font-semibold rounded-full"
              onClick={() => navigate("/")}
            >
              Go Home
            </Button>
            <Button
              size="lg"
              className="cursor-pointer border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3 text-lg font-semibold rounded-full"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
