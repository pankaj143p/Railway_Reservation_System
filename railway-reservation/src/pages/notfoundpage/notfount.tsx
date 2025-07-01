import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
    <h1 className="text-6xl font-bold text-cyan-700 mb-4">404</h1>
    <p className="text-2xl text-gray-700 mb-8">Oops! The page you're looking for doesn't exist.</p>
    <Link
      to="/home"
      className="px-6 py-2 bg-cyan-600 text-white rounded-lg shadow hover:bg-cyan-700 transition"
    >
      Go to Home
    </Link>
  </div>
);

export default NotFound;