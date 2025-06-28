import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import { Camera, User } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import "../Styles/UserProfileForm.css";
import { requestForToken } from "../utils/firebase";
import axios from "axios";


function UserProfileForm() {
  const [formData, setFormData] = useState({
    major: "",
    minor: "",
    level: "",
    graduation_year: "",
    bio: "",
    profile_picture: null,
  });

  const [preview, setPreview] = useState(null);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const toast = useToast();
  const currentYear = new Date().getFullYear();

  // Check if all required fields are filled
  useEffect(() => {
    const { major, level, graduation_year } = formData;
    const isComplete = Boolean(
      major.trim() &&
      level &&
      graduation_year &&
      graduation_year >= 2020 &&
      graduation_year <= currentYear+7
    );
    setIsFormComplete(isComplete);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (e.target.type === "file") {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, profile_picture: file }));
      setPreview(URL.createObjectURL(file));
    } else if (e.target.type === "number") {
      // Handle number inputs specifically
      setFormData(prev => ({ ...prev, [name]: value ? parseInt(value, 10) : "" }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLevelChange = (value) => {
    setFormData(prev => ({ ...prev, level: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormComplete) return;

    try {
      const token = await requestForToken();
      if (token) {
     await axios.put(
       "http://localhost:8000/api/user/profile/",
    {
      ...FormData,
      fcm_token: token
    },
    { withCredentials: true }
  );
}

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "error",
      });
    }
  };

  return (
    <div className="user-profile__form-container">
      <Card className="user-profile__card">
        <CardHeader className="user-profile__card-header">
          <div className="user-profile__avatar-container">
            <Avatar className="user-profile__avatar">
              <AvatarImage src={preview || ""} alt="Profile" />
              <AvatarFallback className="user-profile__avatar-fallback">
                <User className="user-profile__fallback-icon" />
              </AvatarFallback>
            </Avatar>
            <label htmlFor="profilePictureInput" className="user-profile__camera-button">
              <Camera className="user-profile__camera-icon" />
            </label>
            <input
              type="file"
              id="profilePictureInput"
              name="profilePicture"
              accept="image/*"
              onChange={handleChange}
              className="user-profile__file-input"
            />
          </div>
          <CardTitle className="user-profile__card-title">Create Your Profile</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="user-profile__form">
            <div className="user-profile__form-group">
              <Label htmlFor="major" className="user-profile__form-label">
                Major*
              </Label>
              <Input
                id="major"
                name="major"
                type="text"
                placeholder="Your major field of study"
                value={formData.major}
                onChange={handleChange}
                required
                className="user-profile__form-input"
              />
            </div>

            <div className="user-profile__form-group">
              <Label htmlFor="minor" className="user-profile__form-label">
                Minor <span className="user-profile__optional-text">(optional)</span>
              </Label>
              <Input
                id="minor"
                name="minor"
                type="text"
                placeholder="Your minor field of study"
                value={formData.minor}
                onChange={handleChange}
                className="user-profile__form-input"
              />
            </div>

            <div className="user-profile__form-group">
              <Label htmlFor="level" className="user-profile__form-label">
                Academic Level*
              </Label>
              <Select value={formData.level} onValueChange={handleLevelChange}>
                <SelectTrigger className="user-profile__select-trigger">
                  <SelectValue placeholder="Select your academic level" />
                </SelectTrigger>
                <SelectContent className="user-profile__select-content">
                  <SelectItem value="Freshman L1">Freshman </SelectItem>
                  <SelectItem value="Sophomore L1">Sophomore </SelectItem>
                  <SelectItem value="Junior L1">Junior </SelectItem>
                  <SelectItem value="Senior L1">Senior </SelectItem>
                  <SelectItem value="Master">Master</SelectItem>
                  <SelectItem value="PhD">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="user-profile__form-group">
              <Label htmlFor="graduationYear" className="user-profile__form-label">
                Expected Graduation Year*
              </Label>
              <Input
                id="graduationYear"
                name="graduationYear"
                type="number"
                placeholder="e.g., 2025"
                value={formData.graduationYear}
                onChange={handleChange}
                min="2020"
                max="2030"
                className="user-profile__form-input"
              />
            </div>

            <div className="user-profile__form-group">
              <Label htmlFor="bio" className="user-profile__form-label">
                Bio <span className="user-profile__optional-text">(optional)</span>
              </Label>
              <textarea
                id="bio"
                name="bio"
                placeholder="Tell us about yourself, your interests, and goals..."
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="user-profile__form-textarea"
              />
            </div>

            <Button
              type="submit"
              className="user-profile__submit-button"
              disabled={!isFormComplete}
            >
              Create Profile
              {!isFormComplete && (
                <span className="user-profile__required-text"> (Complete required fields*)</span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserProfileForm;