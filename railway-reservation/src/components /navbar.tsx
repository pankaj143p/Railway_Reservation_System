import { Button } from "../components/ui/button";

const Navbar = () => {
  return (
    <div className="bg-gray-800 p-4">
      <div>
        <ul className="flex space-x-4">
          <li className="text-white hover:text-gray-400 cursor-pointer">Home</li>
          <li className="text-white hover:text-gray-400 cursor-pointer">About</li>
          <li className="text-white hover:text-gray-400 cursor-pointer">Contact</li>
        </ul>
       <div>
        <Button variant={"destructive"}>Login</Button>
       </div>
      </div>
      <div>

      </div>
    </div>
  );
}
{/* <div className="text-white text-2xl font-bold">
  IRail Gateway
</div> */}

export default Navbar;
