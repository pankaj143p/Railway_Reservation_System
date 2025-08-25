
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './components/navbar';
import Bot from './components/bot/Bot';
import RouterWrapper from './components/RouterWrapper';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Bot />
        <RouterWrapper />
      </BrowserRouter>
    </>
  );
}

export default App;