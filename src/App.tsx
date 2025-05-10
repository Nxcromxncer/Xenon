import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Login from "./pages/Login";
import Home from "./pages/Home";
import JoinRoom from "./room/JoinRoom";
import CreateRoom from "./room/CreateRoom";
import ProblemIDE from "./competition/ProblemIDE";
import Result from "./competition/Result";
import Layout from "./Layout";
import TeamSetup from "./competition/TeamSetup";
import WaitingRoom from "./competition/WaitingRoom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages without layout */}
        <Route path="/" element={<About />} />
        <Route path="/login" element={<Login />} />

        {/* Pages with layout */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />}>
            <Route path="join" element={<JoinRoom />} />
            <Route path="create" element={<CreateRoom />} />
          </Route>
          <Route path="/competition/:roomId/team" element={<TeamSetup />} />
          <Route
            path="/competition/:roomId/waiting"
            element={<WaitingRoom />}
          />
          <Route path="/competition/:roomId/problem" element={<ProblemIDE />} />
          <Route path="/competition/:roomId/result" element={<Result />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
