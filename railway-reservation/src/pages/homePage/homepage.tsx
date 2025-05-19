import {Navbar} from '../../components/navbar';

const HomePage = () => {
  return (
   <>
   <div className="m-0 p-0">
   <Navbar/>
   </div>
   <div className="">
    <div className="flex flex-col items-center justify-center ">
        <h1 className="text-4xl font-bold mb-4">Welcome to the IRail Gateway</h1>
        {/* <p className="text-lg mb-8 text-red-500">Book your tickets easily and conveniently.</p> */}
     </div>
    </div>
   </>
  );
}

export default HomePage;


