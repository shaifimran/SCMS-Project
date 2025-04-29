import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, AlertCircle, User, LogOut, Bell, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Logo component
  const Logo = () => (
    <Link to="/" className="flex items-center gap-2">
      <AlertCircle size={24} className="text-blue-600" />
      <span className="font-bold text-xl">SCMS</span>
    </Link>
  );

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 backdrop-blur-sm py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Logo />

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {user && (
              <>
                {user.role === 'User' && (
                  <>
                    <NavLink to="/user/dashboard">Dashboard</NavLink>
                    <NavLink to="/complaints/new">New Complaint</NavLink>
                  </>
                )}
                
                {user.role === 'Staff' && (
                  <NavLink to="/staff/dashboard">Dashboard</NavLink>
                )}
                
                {user.role === 'Admin' && (
                  <NavLink to="/admin/dashboard">Dashboard</NavLink>
                )}
              </>
            )}
          </nav>

          {/* User actions - desktop */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Bell size={20} />
                </button>
                <div className="relative group">
                  <button className="flex items-center gap-2 py-2 px-3 rounded-full hover:bg-gray-100 transition-colors">
                    <span className="font-medium">{user.name}</span>
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      {user.name.charAt(0)}
                    </div>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <User size={16} />
                      Profile
                    </Link>
                    <button 
                      onClick={logout} 
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-800">
                  Sign in
                </Link>
                <Link to="/register" className="bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={toggleMenu}
            className="p-2 rounded-md md:hidden focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t mt-1">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              {user ? (
                <>
                  {user.role === 'User' && (
                    <>
                      <NavLink to="/user/dashboard">Dashboard</NavLink>
                      <NavLink to="/complaints/new">New Complaint</NavLink>
                    </>
                  )}
                  
                  {user.role === 'Staff' && (
                    <NavLink to="/staff/dashboard">Dashboard</NavLink>
                  )}
                  
                  {user.role === 'Admin' && (
                    <NavLink to="/admin/dashboard">Dashboard</NavLink>
                  )}
                  
                  <NavLink to="/profile">Profile</NavLink>
                  <button 
                    onClick={logout} 
                    className="flex items-center gap-2 py-2 text-gray-700 hover:text-blue-600"
                  >
                    <LogOut size={18} />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login">Sign in</NavLink>
                  <NavLink to="/register">Register</NavLink>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

// Helper component for nav links
const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`py-2 transition-colors ${
        isActive 
          ? 'text-blue-600 font-medium' 
          : 'text-gray-700 hover:text-blue-600'
      }`}
    >
      {children}
    </Link>
  );
};

export default Header;