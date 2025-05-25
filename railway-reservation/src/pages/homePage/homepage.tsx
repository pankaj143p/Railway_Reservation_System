import {Navbar} from '../../components/navbar';
import logo from '../../../public/homelogo.jpg'

const HomePage = () => {
  return (
   <>
   <div className="m-0 p-0">
   <Navbar/>
   </div>
   <div className="relative">
     
    <img src={logo} className='w-[100%] h-[90vh]'  alt="home-image"/>
    {/* <h1 className="text-4xl font-bold mb-4"></h1> */}
    <div className="absolute pt-5 px-[20%] top-8 text-shadow-foreground font-bold text-5xl text-center">
      Welcome to the IRail Gateway</div>
    <div className="flex flex-col items-center justify-center">
        {/* </div> */}
       
        {/* <p className="text-lg mb-8 text-red-500">Book your tickets easily and conveniently.</p> */}
     </div>
    </div>
   </>
  );
}

export default HomePage;


