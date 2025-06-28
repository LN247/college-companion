import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Bell, 
  Search,
  BookOpen,
  Calendar,
  Users,
  MessageCircle,
  ChevronDown
} from 'lucide-react';
import '../Styles/Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Simulate user data - replace with actual user context
    setUser({
      name: 'John Doe',
      email: 'john@example.com',
      avatar: null
    });
  }, []);

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: BookOpen },
    { name: 'Semester Plan', path: '/semester-plan', icon: Calendar },
    { name: 'Study Groups', path: '/chat', icon: Users },
    { name: 'AI Assistant', path: '/ai-assistant', icon: MessageCircle },
  ];

  const handleLogout = () => {
    // Add logout logic here
    navigate('/login');
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <header className={`modern-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <div className="logo-icon">
            <BookOpen size={24} />
          </div>
          <span className="logo-text">CollegeCompanion</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header-nav desktop-nav">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-link ${isActivePath(item.path) ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Search */}
          <button className="header-action-btn search-btn" aria-label="Search">
            <Search size={20} />
          </button>

          {/* Notifications */}
          <button className="header-action-btn notification-btn" aria-label="Notifications">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>

          {/* User Menu */}
          <div className="user-menu-container">
            <button
              className="user-menu-trigger"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              aria-label="User menu"
            >
              <div className="user-avatar">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <User size={20} />
                )}
              </div>
              <span className="user-name">{user?.name}</span>
              <ChevronDown size={16} className={`chevron ${isUserMenuOpen ? 'rotated' : ''}`} />
            </button>

            {isUserMenuOpen && (
              <div className="user-menu-dropdown">
                <div className="user-menu-header">
                  <div className="user-menu-avatar">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  <div className="user-menu-info">
                    <span className="user-menu-name">{user?.name}</span>
                    <span className="user-menu-email">{user?.email}</span>
                  </div>
                </div>
                
                <div className="user-menu-items">
                  <Link to="/profile" className="user-menu-item">
                    <User size={18} />
                    <span>Profile</span>
                  </Link>
                  <Link to="/settings" className="user-menu-item">
                    <Settings size={18} />
                    <span>Settings</span>
                  </Link>
                  <button onClick={handleLogout} className="user-menu-item logout">
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="mobile-nav-overlay">
          <nav className="mobile-nav">
            <div className="mobile-nav-header">
              <div className="mobile-user-info">
                <div className="mobile-user-avatar">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <User size={24} />
                  )}
                </div>
                <div>
                  <span className="mobile-user-name">{user?.name}</span>
                  <span className="mobile-user-email">{user?.email}</span>
                </div>
              </div>
            </div>

            <div className="mobile-nav-items">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`mobile-nav-item ${isActivePath(item.path) ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="mobile-nav-footer">
              <Link to="/profile" className="mobile-nav-item">
                <User size={20} />
                <span>Profile</span>
              </Link>
              <Link to="/settings" className="mobile-nav-item">
                <Settings size={20} />
                <span>Settings</span>
              </Link>
              <button onClick={handleLogout} className="mobile-nav-item logout">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header; 