import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import About from "./pages/About";
import Home from "./pages/Home";
import JoinTeam from "./team/JoinTeam";
import CreateTeam from "./team/CreateTeam";

import "./styles.css";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />}>
              <Route path="join" element={<JoinTeam />} />
              <Route path="create" element={<CreateTeam />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
