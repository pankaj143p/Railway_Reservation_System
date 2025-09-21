import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/loginPage/login';
import TrainDetails from './pages/trainListPage/trainLists';
import Book from './pages/trainBookPage/book';
import Booked from './pages/confirmationPage/booked';
import Dashboard from './pages/admindashboard/dashboard';
import UsersPage from './pages/admindashboard/userspage/userspage';
import BookingSuccess from './pages/ticketpage/BookingSuccess';
import { Navbar } from './components/navbar';
import ProtectedHome from './components/protectedHome/protectedhome';
import TrainsPage from './pages/admindashboard/trainpage/trainpage';
import HomePage from './pages/homePage/homepage';
import Signup from './pages/signUpPage/signup';
import TicketPage from './pages/admindashboard/ticketpage/ticketpage';
import NotFound from './pages/notfoundpage/notfount';
import BookedTickets from './pages/bookedticketspages/bookedtickets';
import About from './pages/aboutPage/about';
import Services from './pages/servicesPage/services';
import ContactUs from './pages/contactUsPage/contactus';
import Policy from './pages/policyPage/policy';
import Chatbot from './components/bot/Chatbot';
import ForgotPassword from './pages/forgotpasswordpagee/forgotpassword';
import ResetPasswordPage from './pages/forgotpasswordpagee/resetpassword';

function App() {
  const isLoggedIn = !!localStorage.getItem("token");
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Chatbot />
        <Routes>
          <Route path="/" element={<ProtectedHome />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />

          {/* Redirect logged-in users away from login/signup */}
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/signup"
            element={isLoggedIn ? <Navigate to="/" replace /> : <Signup />}
          />

          {/* Protected Routes */}

          <Route path="/trainList" element={<TrainDetails />} />
          <Route path="/book/:trainId" element={<Book />} />
          <Route path='/confirmed/:orderId' element={<Booked />} />
          <Route path='/users' element={<UsersPage />} />
          <Route path='trains' element={<TrainsPage />} />
          <Route path='/forgot-password' element= {isLoggedIn ? <Navigate to="/" replace /> : <ForgotPassword/>} />
          <Route path='/reset-password' element={isLoggedIn ? <Navigate to="/" replace /> : <ResetPasswordPage/>} />
          <Route path='/ticket' element={<BookingSuccess />} />
          <Route
            path='/bookedtickets'
            element={!isLoggedIn ? <Navigate to="/login" replace /> : <BookedTickets />}
          />
          <Route
            path='/home'
            element={!isLoggedIn ? <HomePage /> : <Navigate to="/" replace />}
          />
          <Route path='/tickets' element={<TicketPage />} />
          
          {/* Static Pages */}
          <Route path='/about' element={<About />} />
          <Route path='/services' element={<Services />} />
          <Route path='/contact' element={<ContactUs />} />
          <Route path='/policy' element={<Policy />} />

          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;