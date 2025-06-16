import React, { useState } from 'react';
import '../css/header.css';

const Header = () => {
    const [showAbout, setShowAbout] = useState(false);

    function handleClick() {
        window.location.href = '/home';
    }

    return (
        <div className='header'>
            <div className='navigation'>
                <div className='side left' onClick={handleClick}>
                    <p>CarlPics</p>
                </div>
                <div className='side right'>
                    <p onClick={() => setShowAbout(true)}>About</p>
                </div>
            </div>
            {showAbout && (
                <div className="about-overlay" onClick={() => setShowAbout(false)}>
                    <div className="about-content" onClick={e => e.stopPropagation()}>
                        <button className="about-close-btn" onClick={() => setShowAbout(false)}>×</button>
                        <div className="about-header">
                            <h2>About CarlPics</h2>
                        </div>
                        <p><strong>CarlPics</strong> is a collaborative platform where members of the Carleton community can help identify individuals in Carleton-related photographs. The goal is to support historical preservation and enrich the college’s archival records.</p>
                        <p>This project is a joint effort between the <a href="https://www.carleton.edu/its/services/learning/datasquad/">Carleton DataSquad</a> and the <a href="https://www.carleton.edu/library/collections/archives/">Carleton College Archives</a>.</p>
                        <p>The website was developed by <i>Artem Yushko ’25</i> (backend) and <i>Dake Peng ’25</i> (frontend), both members of the Carleton DataSquad. <i>David Bliss</i>, Digital Archivist & Librarian at Carleton College, provides the data and collects user feedback from this website to be entered to the archive records.</p>
                        <p>For questions or inquiries about this project, please contact <i>Paula Lackie</i> (<a href="mailto:plackie@carleton.edu">plackie@carleton.edu</a>), founder of the Carleton DataSquad, or <i>David Bliss</i> (<a href="mailto:dbliss@carleton.edu">dbliss@carleton.edu</a>), Digital Archivist & Librarian.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;