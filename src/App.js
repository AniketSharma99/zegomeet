import './App.css';
import { Route, Routes } from 'react-router';
import Home from '../src/Pages/Home';
import Room from '../src/Pages/Room';
import { ZPProvider } from './context/ZPContext';
import GroupCall from './Pages/GroupCall';
function App() {
  return (
    <ZPProvider>

      <Routes>
        {/* <Route path='/' element={<Home />} /> */}
        <Route path='/room/:roomID/:userID' element={<Room />} />
        <Route path='/groupCall/:roomID/:userID' element={<GroupCall />} />
        <Route path="*" element={<Home/>} />
      </Routes>
    </ZPProvider>
  );
}

export default App;
