import HomePage from './pages/homePage/homepage';
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/loginPage/login';
import TrainDetails from './pages/trainListPage/trainLists';
import BookTrain from './pages/trainBookPage/book';
// import Payment from './pages/confirmPage/TicketConfirm';




function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/" element={<Payment />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/trainList" element={<TrainDetails />} />
        <Route path='/book/:trainId' element={<BookTrain />} />
      </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
