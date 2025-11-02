import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function SendInspection({ token, restaurant }) {
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setResults(null);
    setLoading(true);

    try {
      // Parse phone numbers (comma or newline separated)
      const numbers = phoneNumbers
        .split(/[,\n]/)
        .map(n => n.trim())
        .filter(n => n.length > 0);

      if (numbers.length === 0) {
        setError('Please enter at least one phone number');
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/whatsapp/send`,
        { 
          restaurantId: restaurant._id,
          phoneNumbers: numbers
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Inspection forms sent successfully!');
      setResults(response.data.results);
      setPhoneNumbers('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send inspection forms');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleNumber = () => {
    setPhoneNumbers('+919876543210');
  };

  return (
    <div>
      <div className="card">
        <h2>Send Inspection Form - {restaurant.name}</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Enter employee phone numbers to receive the WhatsApp inspection form
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Phone Numbers (comma or line separated)</label>
            <textarea
              value={phoneNumbers}
              onChange={(e) => setPhoneNumbers(e.target.value)}
              placeholder="e.g., +919876543210, +919123456789&#10;or one per line"
              rows="4"
              required
            />
            <small style={{ color: '#666', display: 'block', marginTop: '8px' }}>
              Format: +[country code][number] (e.g., +919876543210)
            </small>
          </div>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <div className="flex" style={{ marginTop: '16px' }}>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Sending...' : '📱 Generate & Send WhatsApp Form'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={loadSampleNumber}>
              Load Sample Number
            </button>
          </div>
        </form>

        {results && (
          <div style={{ marginTop: '24px' }}>
            <h3>Send Results</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Phone Number</th>
                  <th>Status</th>
                  <th>Message ID</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index}>
                    <td>{result.phoneNumber}</td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        background: result.success ? '#d4edda' : '#f8d7da',
                        color: result.success ? '#155724' : '#721c24',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        {result.success ? 'Sent' : 'Failed'}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', color: '#666' }}>
                      {result.messageId || result.error || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ 
          marginTop: '24px', 
          padding: '16px', 
          background: '#f8f9fa', 
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          <h4 style={{ marginBottom: '12px' }}>⚠️ WhatsApp API Setup Required</h4>
          <p style={{ marginBottom: '8px' }}>
            To send actual WhatsApp messages, you need to:
          </p>
          <ol style={{ marginLeft: '20px', lineHeight: '1.8' }}>
            <li>Create a Meta Developer Account at <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer">developers.facebook.com</a></li>
            <li>Create a Business App and add WhatsApp product</li>
            <li>Get your Phone Number ID, Business Account ID, and Access Token</li>
            <li>Update the backend .env file with your credentials</li>
            <li>Set up webhook URL for receiving responses</li>
          </ol>
          <p style={{ marginTop: '12px', color: '#666' }}>
            For this prototype, the system will attempt to send messages but may fail without valid API credentials.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SendInspection;