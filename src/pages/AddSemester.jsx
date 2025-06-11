import React, { useState, useCallback } from "react";
import { Button } from "../components/ui/Button";
import CourseForm from "../components/CourseForm";
import SemesterCourseForm from "../components/SemesterForm";
import StepUserPreferencesForm from "../components/UserPrefrenceForm";
import { CheckCircle, Circle, ArrowLeft, ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import "../Styles/AddSemester.css";

const MultiStepFormTracker = () => {
  const [semesterId, setSemesterId] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepCompletion, setStepCompletion] = useState({
    "semester-info": false,
    "course-details": false,
  });

  const steps = [
    {
      id: "semester-info",
      title: "Semester Information",
      component: SemesterCourseForm,
      completed: stepCompletion["semester-info"],
      totalFields: 3, // Example total fields for this step
    },
    {
      id: "course-details",
      title: "Course Details",
      component: CourseForm,
      completed: stepCompletion["course-details"],
      totalFields: 5, // Example total fields for this step
    },
    {
      id: "user-preferences",
      title: "User Preferences",
      component: StepUserPreferencesForm,
      completed: stepCompletion["user-preferences"],
      totalFields: 4, // Example total fields for this step
    },
  ];

  const handleStepCompletion = useCallback(
    (stepId, isCompleted) => {
      setStepCompletion((prev) => ({
        ...prev,
        [stepId]: isCompleted,
      }));

      if (isCompleted && currentStep < steps.length - 1) {
        setTimeout(() => {
          setCurrentStep((prev) => prev + 1);
        }, 500);
      }
    },
    [currentStep, steps.length]
  );

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const safeCurrentStep = Math.min(Math.max(currentStep, 0), steps.length - 1);
  const currentStepData = steps[safeCurrentStep];

  if (!currentStepData) {
    return <div>Loading...</div>;
  }

  const CurrentStepComponent = currentStepData.component;
  const allStepsCompleted = Object.values(stepCompletion).every(Boolean);

  return (
    <div className="multistep-container">
      <div className="multistep-content">
        {/* Header */}
        <div className="multistep-header">
          <h1 className="multistep-title">Add a Semester</h1>
          <p className="multistep-subtitle">
            Complete each step to proceed to the next
          </p>
        </div>

        {/* Current Step Form */}
        <Card className="form-card">
          <CardHeader>
            <CardTitle className="step-title">
              {currentStepData.completed ? (
                <CheckCircle className="completed-icon" />
              ) : (
                <Circle className="pending-icon" />
              )}
              {currentStepData.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CurrentStepComponent
              onFormComplete={(isCompleted) =>
                handleStepCompletion(currentStepData.id, isCompleted)
              }
              semesterId={semesterId}
            />

            {/* Navigation Buttons */}
            <div className="navigation-buttons">
              <Button
                variant="outline"
                onClick={goToPreviousStep}
                disabled={safeCurrentStep === 0}
                className="nav-button prev-button"
              >
                <ArrowLeft className="nav-icon" />
                Previous
              </Button>

              <Button
                onClick={goToNextStep}
                disabled={
                  safeCurrentStep === steps.length - 1 ||
                  !currentStepData.completed
                }
                className="nav-button next-button"
              >
                Next
                <ArrowRight className="nav-icon" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Completion Message */}
        {allStepsCompleted && (
          <Card className="completion-card">
            <CardContent className="completion-content">
              <CheckCircle className="success-icon" />
              <h3 className="success-title">All Steps Completed!</h3>
              <p className="success-message">
                Congratulations! You have successfully completed all form steps.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MultiStepFormTracker;
