import ReactDOM from 'react-dom/client';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from './pages/Home.jsx';
import Picture from './pages/Picture.jsx';
import './css/index.css';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/images`)
      .then((res) => res.json())
      .then((json) => setData(json.images))
      .catch((err) => console.error('Failed to fetch data:', err));
  }, []);
  return (
    <BrowserRouter basename = "/carlpics">
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home data={data} />} />
        <Route path="/:picid" element={<Picture data ={data}/>} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
