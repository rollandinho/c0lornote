import React, { useState, useEffect } from 'react';
import './styles/App.css';

// API base URL
const API_URL = '/api';

// App Component
function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('welcome'); // welcome, login, register, feed, profile
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
      setView('feed');
      loadFeed();
    }
  }, []);

  const loadFeed = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/notes/feed`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setNotes(data);
      }
    } catch (err) {
      console.error('Error loading feed:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPublicNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/notes/public`);
      const data = await response.json();
      if (response.ok) {
        setNotes(data);
      }
    } catch (err) {
      console.error('Error loading public notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e, email, password) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setView('feed');
        loadFeed();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e, username, email, password, displayName) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, displayName }),
      });
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setView('feed');
        loadFeed();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setView('welcome');
    setNotes([]);
  };

  const createNote = async (content, color, backgroundColor) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content, color, backgroundColor }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setNotes([data, ...notes]);
      }
    } catch (err) {
      console.error('Error creating note:', err);
    }
  };

  const likeNote = async (noteId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/notes/${noteId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        setNotes(notes.map(note => {
          if (note._id === noteId) {
            return { ...note, likes: [...note.likes, user.id] };
          }
          return note;
        }));
      }
    } catch (err) {
      console.error('Error liking note:', err);
    }
  };

  return (
    <div className="App">
      {view === 'welcome' && <WelcomePage setView={setView} />}
      {view === 'login' && <LoginPage onLogin={handleLogin} setView={setView} error={error} loading={loading} />}
      {view === 'register' && <RegisterPage onRegister={handleRegister} setView={setView} error={error} loading={loading} />}
      {(view === 'feed' || view === 'discover') && (
        <>
          <Header user={user} setView={setView} handleLogout={handleLogout} currentView={view} />
          <div className="container">
            {view === 'feed' && user && <CreateNote onCreate={createNote} />}
            {loading && <div className="loading">Loading...</div>}
            <NotesGrid notes={notes} user={user} onLike={likeNote} />
          </div>
        </>
      )}
    </div>
  );
}

// Welcome Page Component
function WelcomePage({ setView }) {
  return (
    <div className="welcome">
      <h1>🎨 c0lornote</h1>
      <p>A Social Hub for People Made by the People</p>
      <div className="nav">
        <button onClick={() => setView('login')}>Login</button>
        <button onClick={() => setView('register')}>Sign Up</button>
      </div>
      <div className="features">
        <div className="feature">
          <h3>✨ Colorful Notes</h3>
          <p>Express yourself with vibrant, customizable notes</p>
        </div>
        <div className="feature">
          <h3>👥 Social Connection</h3>
          <p>Connect with people and share your thoughts</p>
        </div>
        <div className="feature">
          <h3>💬 Engage</h3>
          <p>Like and comment on notes from the community</p>
        </div>
      </div>
    </div>
  );
}

// Header Component
function Header({ user, setView, handleLogout, currentView }) {
  return (
    <div className="header">
      <h1>🎨 c0lornote</h1>
      <p>Welcome, {user?.displayName || 'Guest'}!</p>
      <div className="nav">
        <button 
          className={currentView === 'feed' ? 'active' : ''} 
          onClick={() => setView('feed')}
        >
          My Feed
        </button>
        <button 
          className={currentView === 'discover' ? 'active' : ''} 
          onClick={() => setView('discover')}
        >
          Discover
        </button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

// Login Page Component
function LoginPage({ onLogin, setView, error, loading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="auth-container">
      <h2>Login to c0lornote</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={(e) => onLogin(e, email, password)}>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
      <div className="auth-toggle">
        Don't have an account? 
        <button onClick={() => setView('register')}>Sign up</button>
      </div>
    </div>
  );
}

// Register Page Component
function RegisterPage({ onRegister, setView, error, loading }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  return (
    <div className="auth-container">
      <h2>Join c0lornote</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={(e) => onRegister(e, username, email, password, displayName)}>
        <div className="form-group">
          <label>Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Display Name</label>
          <input 
            type="text" 
            value={displayName} 
            onChange={(e) => setDisplayName(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            minLength={6}
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
      </form>
      <div className="auth-toggle">
        Already have an account? 
        <button onClick={() => setView('login')}>Login</button>
      </div>
    </div>
  );
}

// Create Note Component
function CreateNote({ onCreate }) {
  const [content, setContent] = useState('');
  const [color, setColor] = useState('#333333');
  const [backgroundColor, setBackground] = useState('#FFD700');

  const colors = [
    '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DFE6E9', '#74B9FF', '#A29BFE', '#FD79A8'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onCreate(content, color, backgroundColor);
      setContent('');
    }
  };

  return (
    <div className="create-note">
      <h3>Create a New Note</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Choose a color</label>
          <div className="color-picker">
            {colors.map(c => (
              <div
                key={c}
                className={`color-option ${backgroundColor === c ? 'selected' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setBackground(c)}
              />
            ))}
          </div>
        </div>
        <div className="form-group">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={4}
            maxLength={1000}
            required
          />
        </div>
        <button type="submit" className="btn">Share Note</button>
      </form>
    </div>
  );
}

// Notes Grid Component
function NotesGrid({ notes, user, onLike }) {
  if (!notes || notes.length === 0) {
    return <div className="loading">No notes to display</div>;
  }

  return (
    <div className="notes-grid">
      {notes.map(note => (
        <NoteCard key={note._id} note={note} user={user} onLike={onLike} />
      ))}
    </div>
  );
}

// Note Card Component
function NoteCard({ note, user, onLike }) {
  const isLiked = user && note.likes?.includes(user.id);
  const likesCount = note.likes?.length || 0;
  const commentsCount = note.comments?.length || 0;

  return (
    <div className="note-card">
      <div className="note-header">
        <div className="note-avatar">
          {note.author?.displayName?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="note-author">
          <h4>{note.author?.displayName || 'Unknown'}</h4>
          <p>@{note.author?.username || 'unknown'}</p>
        </div>
      </div>
      <div 
        className="note-content" 
        style={{ 
          backgroundColor: note.backgroundColor,
          color: note.color 
        }}
      >
        {note.content}
      </div>
      <div className="note-actions">
        <button 
          className={`note-action-btn ${isLiked ? 'liked' : ''}`}
          onClick={() => user && onLike(note._id)}
          disabled={!user}
        >
          ❤️ {likesCount}
        </button>
        <button className="note-action-btn">
          💬 {commentsCount}
        </button>
      </div>
    </div>
  );
}

export default App;
