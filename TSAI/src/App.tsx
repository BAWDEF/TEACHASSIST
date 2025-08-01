import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { SearchProvider } from './components/layout/SearchContext';
import Layout from './components/layout/Layout'; 
import { Toaster } from './components/ui/toaster'; // <<< Import the Toaster component

// Import your page components
import Dashboard from './pages/Dashboard';
import LessonPlanner from './pages/LessonPlanner';
import AssessmentCreator from './pages/AssessmentCreator';
import MaterialsGenerator from './pages/MaterialsGenerator';
import ResourceLibrary from './pages/ResourceLibrary';
import ProfessionalDevelopment from './pages/ProfessionalDevelopment';
import SettingsPage from './pages/SettingsPage';
import HelpAndSupportPage from './pages/HelpAndSupportPage';

function App() {
  return (
    <Router>
      <SearchProvider>
        <SignedIn>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/lesson-planner" element={<LessonPlanner />} />
              <Route path="/assessment-creator" element={<AssessmentCreator />} />
              <Route path="/materials-generator" element={<MaterialsGenerator />} />
              <Route path="/resource-library" element={<ResourceLibrary />} />
              <Route path="/professional-development" element={<ProfessionalDevelopment />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/help-and-support" element={<HelpAndSupportPage />} />
              
              <Route path="*" element={
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                  <h1 className="text-4xl font-bold text-gray-800">404: Page Not Found</h1>
                </div>
              } />
            </Routes>
          </Layout>
        </SignedIn>
        
        <SignedOut>
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to TeachAssist!</h2>
            <p className="text-lg text-gray-600 mb-6">Please sign in to access your teacher tools.</p>
            <SignInButton mode="modal">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                Sign In / Sign Up
              </button>
            </SignInButton>
          </div>
        </SignedOut>

      </SearchProvider>
      <Toaster /> {/* <<< Add the Toaster component here */}
    </Router>
  );
}

export default App;
