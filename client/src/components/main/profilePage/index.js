import React, { useState } from "react";
import "./index.css";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState({
    name: false,
    username: false,
    email: false,
    about: false,
    github: false,
  });

  const [user, setUser] = useState({
    name: "Hetan Thakkar",
    username: "johndoe",
    email: "johndoe@example.com",
    profilePic: "https://via.placeholder.com/150",
    github: "https://github.com/johndoe",
    about:
      "I am a passionate software engineer with a love for building innovative web applications.",
  });

  const toggleEditing = (field) => {
    setIsEditing((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleChange = (e, field) => {
    setUser((prevState) => ({
      ...prevState,
      [field]: e.target.value,
    }));
  };

  const disableEditing = (field) => {
    setIsEditing((prevState) => ({
      ...prevState,
      [field]: false,
    }));
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <img src={user.profilePic} alt="Profile" className="profile-pic" />
        <div className="profile-info">
          <div className="profile-field">
            {isEditing.name ? (
              <>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => handleChange(e, "name")}
                />
                <button
                  className="save-button"
                  onClick={() => disableEditing("name")}
                >
                  <i className="fas fa-check"></i>
                </button>
              </>
            ) : (
              <>
                <h2>{user.name}</h2>
                <button
                  className="edit-button"
                  onClick={() => toggleEditing("name")}
                >
                  <i className="fas fa-pen"></i>
                </button>
              </>
            )}
          </div>
          <div className="profile-field">
            {isEditing.username ? (
              <>
                <input
                  type="text"
                  value={user.username}
                  onChange={(e) => handleChange(e, "username")}
                />
                <button
                  className="save-button"
                  onClick={() => disableEditing("username")}
                >
                  <i className="fas fa-check"></i>
                </button>
              </>
            ) : (
              <>
                <h3>{user.username}</h3>
                <button
                  className="edit-button"
                  onClick={() => toggleEditing("username")}
                >
                  <i className="fas fa-pen"></i>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="profile-body">
        <div className="profile-field">
          {isEditing.email ? (
            <>
              <input
                type="email"
                value={user.email}
                onChange={(e) => handleChange(e, "email")}
              />
              <button
                className="save-button"
                onClick={() => disableEditing("email")}
              >
                <i className="fas fa-check"></i>
              </button>
            </>
          ) : (
            <>
              <p>{user.email}</p>
              <button
                className="edit-button"
                onClick={() => toggleEditing("email")}
              >
                <i className="fas fa-pen"></i>
              </button>
            </>
          )}
        </div>
        <div className="profile-section">
          <h4>About</h4>
          <div className="profile-field">
            {isEditing.about ? (
              <>
                <textarea
                  value={user.about}
                  onChange={(e) => handleChange(e, "about")}
                />
                <button
                  className="save-button"
                  onClick={() => disableEditing("about")}
                >
                  <i className="fas fa-check"></i>
                </button>
              </>
            ) : (
              <>
                <p>{user.about}</p>
                <button
                  className="edit-button"
                  onClick={() => toggleEditing("about")}
                >
                  <i className="fas fa-pen"></i>
                </button>
              </>
            )}
          </div>
        </div>
        <div className="profile-section">
          <h4>GitHub</h4>
          <div className="profile-field">
            {isEditing.github ? (
              <>
                <input
                  type="text"
                  value={user.github}
                  onChange={(e) => handleChange(e, "github")}
                />
                <button
                  className="save-button"
                  onClick={() => disableEditing("github")}
                >
                  <i className="fas fa-check"></i>
                </button>
              </>
            ) : (
              <>
                <a href={user.github} target="_blank" rel="noopener noreferrer">
                  {user.github}
                </a>
                <button
                  className="edit-button"
                  onClick={() => toggleEditing("github")}
                >
                  <i className="fas fa-pen"></i>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
