import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import "./App.css";
const Landing = lazy(() => import("./pages/landing"));
const MeetTheTeam = lazy(() => import("./pages/meet-the-team"));
const OurWork = lazy(() => import("./pages/our-work"));
const JoinUs = lazy(() => import("./pages/join-us"));
const OurMission = lazy(() => import("./pages/our-mission"));
const MarkdownPage = lazy(() => import("./pages/MarkdownPage"));

function App() {
  return (
    <Router>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/meet-the-team" element={<MeetTheTeam />} />
          <Route path="/our-work" element={<OurWork />} />
          <Route path="/markdown-viewer/:slug" element={<MarkdownPage />} />
          <Route path="/our-mission" element={<OurMission />} />
          <Route path="/join-us" element={<JoinUs />} />
          <Route path="/application" element={<JoinUs />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
