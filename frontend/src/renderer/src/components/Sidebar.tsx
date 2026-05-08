// Nav links

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Sidebar.css'

function Sidebar(): React.JSX.Element {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <nav className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
            <button
                className="toggle-btn"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? '<' : '>'}
            </button>
            {isOpen && (
                <>
                    <Link to="/">Viewer</Link>
                    <Link to="/scans">Coords</Link>
                </>
            )}
        </nav>
    )
}

export default Sidebar