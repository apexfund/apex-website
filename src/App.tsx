import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import "./App.css";
import PostDetail from "./pages/PostDetail";
import Loading from "./components/Loading";

const Landing = lazy(() => import("./pages/landing"));
const MeetTheTeam = lazy(() => import("./pages/meet-the-team"));
const OurWork = lazy(() => import("./pages/our-work"));
const Application = lazy(() => import("./pages/application"));

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/meet-the-team" element={<MeetTheTeam />} />
          <Route path="/our-work" element={<OurWork />} />
          <Route path="/our-work/:slug" element={<PostDetail />} />
          <Route path="/application" element={<Application />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
