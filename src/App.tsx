import React, { useState, useEffect, useRef } from 'react';
import { Page, Project, User } from './types';
import { InitialProjects } from './data';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Page components
import { Home } from './components/pages/Home';
import { Projects } from './components/pages/Projects';
import { WaqfPage } from './components/pages/WaqfPage';
import { Invest } from './components/pages/Invest';
import { Culture } from './components/pages/Culture';
import { Contact } from './components/pages/Contact';
import { Dashboard } from './components/pages/Dashboard';
import { AuthModal } from './components/AuthModal';
import { WaqfAiAssistant } from './components/WaqfAiAssistant';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  
  // Authentication & session state
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  // States related to checkout auto-matching presets
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // About Section anchor ref on Homepage
  const aboutRef = useRef<HTMLDivElement | null>(null);

  // Fetch projects from the backend API
  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjectsList(data);
        localStorage.setItem('waqf_projects_list', JSON.stringify(data));
      } else {
        throw new Error('Failed to fetch from backend');
      }
    } catch (error) {
      console.warn("Backend API offline or error. Falling back to local storage.", error);
      const savedProjects = localStorage.getItem('waqf_projects_list');
      if (savedProjects) {
        try {
          setProjectsList(JSON.parse(savedProjects));
        } catch (e) {
          setProjectsList(InitialProjects);
        }
      } else {
        setProjectsList(InitialProjects);
        localStorage.setItem('waqf_projects_list', JSON.stringify(InitialProjects));
      }
    }
  };

  // Check for active token and user session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('waqf_token');
    const savedUser = localStorage.getItem('waqf_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
        
        // Verify token with server
        fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${savedToken}`
          }
        })
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error('Stale token');
          }
        })
        .then(data => {
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem('waqf_user', JSON.stringify(data.user));
          }
        })
        .catch(err => {
          console.warn("Session expired or invalid token:", err);
          handleLogout();
        });
      } catch (e) {
        handleLogout();
      }
    }
  }, []);

  const handleAuthSuccess = (loggedInUser: User, sessionToken: string) => {
    setUser(loggedInUser);
    setToken(sessionToken);
    localStorage.setItem('waqf_token', sessionToken);
    localStorage.setItem('waqf_user', JSON.stringify(loggedInUser));
    
    // Redirect to dashboard on login
    handlePageChange('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('waqf_token');
    localStorage.removeItem('waqf_user');
    handlePageChange('home');
  };

  // Initialize or fetch project progress states with LocalStorage persistence
  useEffect(() => {
    fetchProjects();
  }, []);

  // Standard smooth reset scrolling when navigation occurs
  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  const handleScrollToAbout = () => {
    setTimeout(() => {
      aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  // Click handler from project cards
  const handleSelectProjectToDonate = (project: Project) => {
    setSelectedProject(project);
  };

  // Record a successful donation in local state in real-time
  const handleRecordContribution = (projectName: string, amount: number) => {
    const updated = projectsList.map((p) => {
      if (p.title === projectName) {
        return {
          ...p,
          currentAmount: p.currentAmount + amount,
          donorCount: p.donorCount + 1,
        };
      }
      return p;
    });
    setProjectsList(updated);
    localStorage.setItem('waqf_projects_list', JSON.stringify(updated));
    
    // Clear selections on successful contribution
    setSelectedProject(null);

    // Refresh projects from backend to match synchronized state
    fetchProjects();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F6F0] font-sans antialiased text-[#1a1a1a]">
      {/* Floating navigation header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handlePageChange}
        onScrollToAbout={handleScrollToAbout}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main Dynamic Viewport container */}
      <main className="flex-grow">
        {currentPage === 'home' && (
          <Home
            onNavigatePage={handlePageChange}
            aboutRef={aboutRef}
            onQuickDonate={(p) => {
              handleSelectProjectToDonate(p);
              handlePageChange('waqf');
            }}
            projectsList={projectsList}
          />
        )}

        {currentPage === 'projects' && (
          <Projects
            onNavigatePage={handlePageChange}
            onSelectProject={handleSelectProjectToDonate}
            projectsList={projectsList}
          />
        )}

        {currentPage === 'waqf' && (
          <WaqfPage
            onNavigatePage={handlePageChange}
            selectedProject={selectedProject}
            onRecordContribution={handleRecordContribution}
            projectsList={projectsList}
            user={user}
          />
        )}

        {currentPage === 'invest' && (
          <Invest />
        )}

        {currentPage === 'culture' && (
          <Culture />
        )}

        {currentPage === 'contact' && (
          <Contact />
        )}

        {currentPage === 'dashboard' && user && token && (
          <Dashboard
            user={user}
            token={token}
            projectsList={projectsList}
            onUpdateUser={(updated) => {
              setUser(updated);
              localStorage.setItem('waqf_user', JSON.stringify(updated));
            }}
            onNavigatePage={handlePageChange}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Footer bar */}
      <Footer 
        onNavigate={handlePageChange} 
        onScrollToAbout={handleScrollToAbout} 
      />

      {/* Auth popup portal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Floating Waqf AI Assistant */}
      <WaqfAiAssistant />
    </div>
  );
}
