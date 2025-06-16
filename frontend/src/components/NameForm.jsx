import { useState } from 'react';
import '../css/nameform.css';

const NameForm = ({picid}) => {
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!firstName.trim() || !lastName.trim()) {
            setError('First name and last name is required.');
            return;
        }
    try {
        const res = await fetch('https://carlpics-backend.onrender.com/add-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, middleName, lastName, picid}),
        });
        const data = await res.json();
        console.log('Response:', data);
        if (!data.success) {
            setError('Failed to submit. Please try again.');
            return;
        }
        setSubmitted(true);
        setError('');
        setFirstName('');
        setMiddleName('');
        setLastName('');
        console.log('Submitted:', firstName, middleName, lastName);
    } catch (err) {
        setError('Network error. Please try again.');
        console.error(err);
    }

    };
    const handleReset = () => {
    window.location.reload(); // Refresh the page
    };
    return (
        <>
        <div className='form-container'>
            <div className='textarea-container'>
            <textarea
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First"
            />
            <textarea
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                placeholder="Middle (Optional)"
            />
            <textarea
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last"
                className="last-name-textarea"
            />
            </div>
            <button
            className={`submit-button ${submitted ? 'submitted' : ''}`}
            onClick={handleSubmit}
            disabled={submitted}
            >
                    {submitted ? '✔ Submitted!' : 'Submit'}
            </button>
            {error ? (
            <span className="error-inline">{error}</span>
            ) : (
            submitted && (
                <span className="submit-another" onClick={handleReset}>
                Submit another?
                </span>
            )
            )}
        </div>
        </>);
}
export default NameForm;