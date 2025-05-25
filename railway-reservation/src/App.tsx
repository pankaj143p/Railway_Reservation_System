import HomePage from './pages/homePage/homepage';
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/loginPage/login';
import TrainDetails from './pages/trainListPage/trainLists';


function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/trainList" element={<TrainDetails />} />
        <Route path="/trainBook/:trainId" element={<TrainDetails />} />
      </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
