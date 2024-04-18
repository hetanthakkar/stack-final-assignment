import { useNavigate } from "react-router-dom";
import "./index.css";
import { useState } from "react";

const Header = ({ search, setQuesitonPage, setProfile }) => {
  const [val, setVal] = useState(search);
  const navigate = useNavigate();
  const handleSignout = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      navigate("/");
    }
  };
  const handleShowProfile = () => {
    console.log("adikps");
    setProfile(true);
    // navigate("/show-user");
  };
  return (
    <div id="header" className="header">
      <div className="title">Fake Stack Overflow</div>
      <input
        className="searchbar"
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
        <button onClick={handleShowProfile}>Profile</button>
        <button onClick={handleSignout}>Sign Out</button>
      </div>
    </div>
  );
};

export default Header;
