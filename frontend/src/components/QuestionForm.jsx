import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function QuestionForm({ token, restaurant, onComplete }) {
  const [text, setText] = useState('');
  const [type, setType] = useState('yes/no');
  const [selectedSection, setSelectedSection] = useState('');
  const [sections, setSections] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSections();
    fetchQuestions();
  }, [restaurant]);

  const fetchSections = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/sections/restaurant/${restaurant._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSections(response.data);
      if (response.data.length > 0) {
        setSelectedSection(response.data[0]._id);
      }
    } catch (err) {
      console.error('Error fetching sections:', err);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/questions/restaurant/${restaurant._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuestions(response.data);
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axios.post(
        `${API_URL}/api/questions`,
        { 
          text, 
          type, 
          section: selectedSection,
          restaurant: restaurant._id 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Question added successfully!');
      setText('');
      fetchQuestions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create question');
    } finally {
      setLoading(false);
    }
  };

  const addSampleQuestions = async () => {
    const billingSection = sections.find(s => s.name === 'Billing Counter');
    
    if (!billingSection) {
      setError('Please create sections first');
      return;
    }

    const sampleQuestions = [
      { text: 'Is billing machine working fine?', type: 'yes/no', section: billingSection._id },
      { text: 'Is the card-swiping machine working fine?', type: 'yes/no', section: billingSection._id },
      { text: 'How many people are currently waiting in queue?', type: 'number', section: billingSection._id }
    ];

    for (const question of sampleQuestions) {
      try {
        await axios.post(
          `${API_URL}/api/questions`,
          { ...question, restaurant: restaurant._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error('Error creating question:', err);
      }
    }

    setSuccess('Sample questions added!');
    fetchQuestions();
  };

  const groupedQuestions = sections.map(section => ({
    section,
    questions: questions.filter(q => q.section._id === section._id)
  }));

  return (
    <div>
      <div className="card">
        <h2>Add Questions for {restaurant.name}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              required
            >
              {sections.map((section) => (
                <option key={section._id} value={section._id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Question</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., Is billing machine working fine?"
              required
            />
          </div>

          <div className="form-group">
            <label>Question Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="yes/no">Yes/No</option>
              <option value="number">Number</option>
              <option value="text">Text</option>
            </select>
          </div>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <div className="flex" style={{ marginTop: '16px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Question'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={addSampleQuestions}>
              Add Sample Questions
            </button>
            {questions.length > 0 && (
              <button type="button" className="btn btn-success" onClick={onComplete}>
                Continue to Send →
              </button>
            )}
          </div>
        </form>
      </div>

      {groupedQuestions.map(({ section, questions }) => (
        questions.length > 0 && (
          <div className="card" key={section._id}>
            <h3>{section.name} ({questions.length} questions)</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question) => (
                  <tr key={question._id}>
                    <td>{question.text}</td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        background: '#e9ecef',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        {question.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ))}
    </div>
  );
}

export default QuestionForm;