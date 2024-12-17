import './App.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import KakaoMap from './MapAPI/KakaoMap';
import BasicMap from './MapAPI/BasicMap';

function App() {
  return (
    <div className="App">
        <BrowserRouter>
          <About />
          <Routes>
            <Route path={"/"} element={<Home />} />
            
            <Route path="/KakaoMap" element={<KakaoMap />} />
            <Route path="/BasicMap" element={<BasicMap />} />
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
      <Link to="/KakaoMap">지도</Link><br/>
      <Link to="/BasicMap">지도01</Link><br/>
    </div>
  )
}

export default App;
