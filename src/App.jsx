import { useState } from "react";
import './App.css';

const initialStudents = [
  { id: 1, name: "Alice", score: 85 },
  { id: 2, name: "Bob", score: 92 },
  { id: 3, name: "Charlie", score: 78 }
];

const fetchStudents = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Alice", score: 85 },
        { id: 2, name: "Bob", score: 92 },
        { id: 3, name: "Charlie", score: 78 },
        { id: 4, name: "Diana", score: 95 }
      ]);
    }, 1000);
  });
};

const classifyScore = (score) => {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  return "Needs Improvement";
};

const Student = ({ id, name, score, onLog, onRemove }) => {
  const category = classifyScore(score);
  const isExcellent = score >= 90;

  return (
    <div className="student-card">
      <div className="student-content">
        <div className="student-info">
          <h3 className="student-name">{name}</h3>
          <p className="student-score">Score: <strong>{score}</strong></p>
          <p className="student-category">
            Category: <span className="category-text">{category}</span>
          </p>
          {isExcellent && <p className="excellent-badge">⭐ Excellent!</p>}
        </div>
        <div className="student-actions">
          <button onClick={() => onLog(name)} className="btn-log">
            Log Name
          </button>
          <button onClick={() => onRemove(id)} className="btn-remove">
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [students, setStudents] = useState(initialStudents);
  const [newName, setNewName] = useState("");
  const [newScore, setNewScore] = useState("");
  const [search, setSearch] = useState("");
  const [showPassingOnly, setShowPassingOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddStudent = () => {
    const scoreNumber = Number(newScore);
    
    if (!newName || Number.isNaN(scoreNumber)) {
      alert("Please enter a valid name and score");
      return;
    }
    
    const newStudent = {
      id: Date.now(),
      name: newName,
      score: scoreNumber
    };
    
    setStudents([...students, newStudent]);
    
    setNewName("");
    setNewScore("");
  };

  const handleLogName = (name) => {
    console.log("Student name:", name);
  };

  const handleRemoveStudent = (id) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
  };

  const handleLoadStudents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchStudents();
      const existingIds = students.map(s => s.id);
      const newStudents = data.filter(student => !existingIds.includes(student.id));
      setStudents([...students, ...newStudents]);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to load students");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const isPassing = student.score >= 80;
    return showPassingOnly ? matchesSearch && isPassing : matchesSearch;
  });

  return (
    <div className="app-container">
      <div className="app-content">
        <h1 className="app-title">Student List Manager</h1>

        <div className="control-grid">
          <div className="card">
            <h2 className="card-title">Load Data</h2>
            <button 
              onClick={handleLoadStudents} 
              disabled={isLoading} 
              className={`btn-primary full-width ${isLoading ? 'disabled' : ''}`}
            >
              {isLoading ? "Loading..." : "Load Students"}
            </button>
            {isLoading && <p className="loading-text">Loading...</p>}
            {error && <p className="error-text">{error}</p>}
          </div>

          <div className="card">
            <h2 className="card-title">Add Student</h2>
            <div className="form-group">
              <input
                type="text"
                placeholder="Student name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="input-field"
              />
              <input
                type="number"
                placeholder="Score (0-100)"
                value={newScore}
                onChange={(e) => setNewScore(e.target.value)}
                className="input-field"
              />
              <button onClick={handleAddStudent} className="btn-primary">
                Add Student
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Search & Filter</h2>
          <div className="filter-group">
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field flex-grow"
            />
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showPassingOnly}
                onChange={(e) => setShowPassingOnly(e.target.checked)}
                className="checkbox-input"
              />
              Show passing only (≥80)
            </label>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">
            Students ({filteredStudents.length})
          </h2>
          {filteredStudents.length === 0 ? (
            <p className="no-students">No students found.</p>
          ) : (
            <div className="students-list">
              {filteredStudents.map((student) => (
                <Student
                  key={student.id}
                  id={student.id}
                  name={student.name}
                  score={student.score}
                  onLog={handleLogName}
                  onRemove={handleRemoveStudent}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;