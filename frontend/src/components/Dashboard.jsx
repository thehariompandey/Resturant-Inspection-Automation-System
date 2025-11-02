import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Dashboard({ token }) {
  const [responses, setResponses] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [responsesRes, restaurantsRes] = await Promise.all([
        axios.get(`${API_URL}/api/responses`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/api/restaurants`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setResponses(responsesRes.data);
      setRestaurants(restaurantsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredResponses = selectedRestaurant === 'all'
    ? responses
    : responses.filter(r => r.restaurant?._id === selectedRestaurant);

  if (loading) {
    return (
      <div className="card">
        <div className="loading">Loading responses...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="flex-between">
          <h2>📊 Inspection Dashboard</h2>
          <button onClick={fetchData} className="btn btn-secondary">
            🔄 Refresh
          </button>
        </div>

        {restaurants.length > 0 && (
          <div className="form-group" style={{ marginTop: '20px' }}>
            <label>Filter by Restaurant</label>
            <select
              value={selectedRestaurant}
              onChange={(e) => setSelectedRestaurant(e.target.value)}
            >
              <option value="all">All Restaurants</option>
              {restaurants.map((restaurant) => (
                <option key={restaurant._id} value={restaurant._id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {filteredResponses.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
            No inspection responses yet. Send an inspection form to employees to see responses here.
          </p>
        </div>
      ) : (
        filteredResponses.map((response) => (
          <div className="card" key={response._id}>
            <div className="flex-between mb-2">
              <div>
                <h3>{response.restaurant?.name || 'Unknown Restaurant'}</h3>
                <p style={{ color: '#666', marginTop: '4px' }}>
                  Section: <strong>{response.section?.name || 'Unknown'}</strong>
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  By: {response.employeeName}
                </p>
                <p style={{ fontSize: '12px', color: '#999' }}>
                  {response.employeePhone}
                </p>
                <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                  {new Date(response.submittedAt).toLocaleString()}
                </p>
              </div>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Answer</th>
                </tr>
              </thead>
              <tbody>
                {response.answers.map((answer, index) => (
                  <tr key={index}>
                    <td>{answer.questionText}</td>
                    <td>
                      <strong>
                        {typeof answer.answer === 'object' 
                          ? JSON.stringify(answer.answer)
                          : answer.answer}
                      </strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}

      {filteredResponses.length > 0 && (
        <div className="card" style={{ background: '#f8f9fa' }}>
          <h4>Summary</h4>
          <p style={{ marginTop: '8px' }}>
            Total Responses: <strong>{filteredResponses.length}</strong>
          </p>
          {selectedRestaurant !== 'all' && (
            <p style={{ marginTop: '4px' }}>
              For: <strong>
                {restaurants.find(r => r._id === selectedRestaurant)?.name}
              </strong>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;