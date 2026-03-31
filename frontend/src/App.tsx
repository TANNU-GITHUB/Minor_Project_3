import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { PapersPage } from './pages/PapersPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { StudyPage } from './pages/StudyPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/papers" element={<PapersPage />} />
        <Route path="/study/:paperId" element={<StudyPage />} />
        <Route
          path="/mind-maps"
          element={
            <PlaceholderPage
              title="Mind Maps"
              description="Create and explore interactive mind maps from your research papers"
            />
          }
        />
        <Route
          path="/flashcards"
          element={
            <PlaceholderPage
              title="Flashcards"
              description="Study with AI-generated flashcards for spaced repetition learning"
            />
          }
        />
        <Route
          path="/notes"
          element={<PlaceholderPage title="Notes" description="Your annotated notes and highlights from all papers" />}
        />
        <Route
          path="/progress"
          element={
            <PlaceholderPage
              title="Progress Analytics"
              description="Track your learning progress with detailed statistics and insights"
            />
          }
        />
        <Route
          path="/settings"
          element={
            <PlaceholderPage
              title="Settings"
              description="Customize your Lumina experience and account preferences"
            />
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
