import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function RestaurantForm({ token, onRestaurantCreated, selectedRestaurant, onRestaurantSelected }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/restaurants`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRestaurants(response.data);
    } catch (err) {
      console.error('Error fetching restaurants:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/restaurants`,
        { name, location },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Restaurant created successfully!');
      setName('');
      setLocation('');
      fetchRestaurants();
      onRestaurantCreated(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create restaurant');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = () => {
    setName("McDonald's India - Jayanagar");
    setLocation('Jayanagar, Bangalore');
  };

  return (
    <div>
      <div className="card">
        <h2>Create Restaurant</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Restaurant Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., McDonald's India - Jayanagar"
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Jayanagar, Bangalore"
              required
            />
          </div>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <div className="flex" style={{ marginTop: '16px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Restaurant'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={loadSampleData}>
              Load Sample Data
            </button>
          </div>
        </form>
      </div>

      {restaurants.length > 0 && (
        <div className="card">
          <h3>Existing Restaurants</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((restaurant) => (
                <tr key={restaurant._id} style={{ 
                  background: selectedRestaurant?._id === restaurant._id ? '#e7f3ff' : 'transparent'
                }}>
                  <td>{restaurant.name}</td>
                  <td>{restaurant.location}</td>
                  <td>{new Date(restaurant.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => onRestaurantSelected(restaurant)}
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      {selectedRestaurant?._id === restaurant._id ? 'Selected' : 'Select'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RestaurantForm;