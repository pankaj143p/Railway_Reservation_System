import HomePage from './pages/homePage/homepage';
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/loginPage/login';
import TrainDetails from './pages/trainListPage/trainLists';
import Book from './pages/trainBookPage/book';
import Booked from './pages/confirmationPage/booked';
// import dotenv from 'dotenv';
// dotenv.config();

function App() {
  // console.log("API_GATEWAY_URI", import.meta.env.API_GATEWAY_URI);
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/trainList" element={<TrainDetails />} />
        <Route path="/book/:trainId" element={<Book />} />
        <Route path='confirmed' element={<Booked/>} />
      </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
