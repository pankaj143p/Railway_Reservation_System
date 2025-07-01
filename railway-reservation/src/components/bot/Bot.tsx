import { AiFillMessage } from "react-icons/ai";
import { Link } from "react-router-dom";

const Bot = () => {
  return (
    <div className="fixed bottom-5 sm:right-8 right-4 z-[999] cursor-pointer text-white text-4xl bg-blue-950 w-16 h-16 flex items-center justify-center rounded-full animate-bounce hover:bg-cyan-800 transition-colors duration-300 shadow-lg">
      <Link to="/contact" title="Contact Support">
        <AiFillMessage/>
      </Link>  
    </div>
  );
};

export default Bot;
