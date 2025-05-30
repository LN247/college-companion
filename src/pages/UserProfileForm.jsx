import React, { useState } from 'react';
import '../Styles/UserProfileForm.css'; // Adjust the path as necessary

function UserProfileForm() {
  const [formData, setFormData] = useState({
    username: '',
    Major: '',
    minor: '',
    level: '',
    graduationYear: '',
    bio: '',
    profilePicture: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, profilePicture: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Submitted!");
  };

  return (
    <div className="profile-page">
      <form className="profile-card" onSubmit={handleSubmit}>
        <div className="profile-pic-wrapper">
          <label htmlFor="profilePictureInput" className="profile-pic-label">
            <img
              src={preview || 'https://placehold.co/600x400.png?text=Profile+Picture'}
              alt="Profile"
              className="profile-pic"
            />
            <div className="overlay">Add/Change</div>
          </label>
          <input
            type="file"
            id="profilePictureInput"
            name="profilePicture"
            accept="image/*"
            onChange={handleChange}
            hidden
          />
        </div>

        <h2>Signup Here</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="Major"
          placeholder=" Major"
          value={formData.Major}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="minor"
          placeholder="Minor (optional)"
          value={formData.minor}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="level"
          placeholder="Level"
          value={formData.level}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="graduationYear"
          placeholder="Graduation Year"
          value={formData.graduationYear}
          onChange={handleChange}
        />

        <textarea
          name="bio"
          placeholder="Tell us about yourself"
          value={formData.bio}
          onChange={handleChange}
        />

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default UserProfileForm;
