import "./index.css";
import { useState } from "react";

const Header = ({ search, setQuesitonPage }) => {
    const [val, setVal] = useState(search);
    return (
        <div id="header" className="header">
            
            <div className="title">Fake Stack Overflow</div>
            <input className="searchbar"
                id="searchBar"
                placeholder="Search ..."
                type="text"
                value={val}
                onChange={(e) => {
                    setVal(e.target.value);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        setQuesitonPage(e.target.value, "Search Results");
                    }
                }}
            />
            <div className="Profile_signout">
            <button>Profile</button>
            <button>Sign Out</button>
            </div>


        </div>
    );
};

export default Header;
