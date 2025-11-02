import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function SectionForm({ token, restaurant, onComplete }) {
  const [name, setName] = useState('');
  const [sections, setSections] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSections();
  }, [restaurant]);

  const fetchSections = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/sections/restaurant/${restaurant._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSections(response.data);
    } catch (err) {
      console.error('Error fetching sections:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axios.post(
        `${API_URL}/api/sections`,
        { name, restaurant: restaurant._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Section added successfully!');
      setName('');
      fetchSections();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create section');
    } finally {
      setLoading(false);
    }
  };

  const addSampleSections = async () => {
    const sampleSections = ['Billing Counter', 'Dining Area', 'Washroom Area'];
    
    for (const sectionName of sampleSections) {
      try {
        await axios.post(
          `${API_URL}/api/sections`,
          { name: sectionName, restaurant: restaurant._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error(`Error creating ${sectionName}:`, err);
      }
    }
    
    setSuccess('Sample sections added!');
    fetchSections();
  };

  return (
    <div>
      <div className="card">
        <h2>Add Sections for {restaurant.name}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Section Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Billing Counter, Dining Area"
              required
            />
          </div>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <div className="flex" style={{ marginTop: '16px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Section'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={addSampleSections}>
              Add Sample Sections
            </button>
            {sections.length > 0 && (
              <button type="button" className="btn btn-success" onClick={onComplete}>
                Continue to Questions →
              </button>
            )}
          </div>
        </form>
      </div>

      {sections.length > 0 && (
        <div className="card">
          <h3>Sections ({sections.length})</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => (
                <tr key={section._id}>
                  <td>{section.name}</td>
                  <td>{new Date(section.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SectionForm;