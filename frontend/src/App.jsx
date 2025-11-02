import { useState, useEffect } from 'react';
import Login from './components/Login';
import RestaurantForm from './components/RestaurantForm';
import SectionForm from './components/SectionForm';
import QuestionForm from './components/QuestionForm';
import SendInspection from './components/SendInspection';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [activeTab, setActiveTab] = useState('restaurant');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const handleLogout = () => {
    setToken(null);
    setSelectedRestaurant(null);
    setActiveTab('restaurant');
  };

  if (!token) {
    return <Login onLogin={setToken} />;
  }

  return (
    <div>
      <div className="header">
        <div className="container">
          <div className="flex-between">
            <h1>🏪 Heyopey Restaurant Inspection</h1>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
          <div className="nav">
            <button
              className={activeTab === 'restaurant' ? 'active' : ''}
              onClick={() => setActiveTab('restaurant')}
            >
              Create Restaurant
            </button>
            <button
              className={activeTab === 'sections' ? 'active' : ''}
              onClick={() => setActiveTab('sections')}
              disabled={!selectedRestaurant}
            >
              Add Sections
            </button>
            <button
              className={activeTab === 'questions' ? 'active' : ''}
              onClick={() => setActiveTab('questions')}
              disabled={!selectedRestaurant}
            >
              Add Questions
            </button>
            <button
              className={activeTab === 'send' ? 'active' : ''}
              onClick={() => setActiveTab('send')}
              disabled={!selectedRestaurant}
            >
              Send Inspection
            </button>
            <button
              className={activeTab === 'dashboard' ? 'active' : ''}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        {activeTab === 'restaurant' && (
          <RestaurantForm
            token={token}
            onRestaurantCreated={(restaurant) => {
              setSelectedRestaurant(restaurant);
              setActiveTab('sections');
            }}
            selectedRestaurant={selectedRestaurant}
            onRestaurantSelected={setSelectedRestaurant}
          />
        )}

        {activeTab === 'sections' && selectedRestaurant && (
          <SectionForm
            token={token}
            restaurant={selectedRestaurant}
            onComplete={() => setActiveTab('questions')}
          />
        )}

        {activeTab === 'questions' && selectedRestaurant && (
          <QuestionForm
            token={token}
            restaurant={selectedRestaurant}
            onComplete={() => setActiveTab('send')}
          />
        )}

        {activeTab === 'send' && selectedRestaurant && (
          <SendInspection
            token={token}
            restaurant={selectedRestaurant}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard token={token} />
        )}
      </div>
    </div>
  );
}

export default App;