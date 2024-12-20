import './App.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

import MapCreate from './MapAPI/MapCreate';
import MapTest from './MapAPI/Maptest';

function App() {
  return (
    <div className="App">
        <BrowserRouter>
          <About />
          <Routes>
            <Route path={"/"} element={<Home />} />
            <Route path="/create" element={<MapCreate/>} />
            <Route path="/test" element={<MapTest/>} />
          </Routes>
        </BrowserRouter>
    </div>
  );
}

function About() {
  return (
    <div style={{border: '2px blue solid'}}>
      <Link to="/">Home으로 이동</Link><br/>
    </div>
  )
}

function Home() {
  return(
    <div>
      <h4>지도 Test</h4>
      <Link to="/create">지도1</Link><br/>
      <Link to="/test">테스트</Link><br/>
    </div>
  )
}

export default App;
