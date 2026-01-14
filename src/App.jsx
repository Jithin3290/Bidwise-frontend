import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Auth/Register";
import Navbar from "./components/Layout/Navbar";

function App() {
  return (
    <>
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      
    </div>
    </>
  );
}

export default App;
