import React, { useState, useCallback } from "react";
import { Button } from "../components/ui/Button";
import CourseForm from "../components/CourseForm";
import SemesterForm  from '../components/SemesterForm'
import { CheckCircle, Circle, ArrowLeft, ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import "../Styles/AddSemester.css";
import UserPrefrenceForm from "../components/UserPrefrenceForm";

const MultiStepFormTracker = () => {

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
   const [stepCompletion, setStepCompletion] = useState({
    "semester-info": false,
    "course-form": false,
    "user-preferences": false,
  });

  const steps = [
    {
      id: "semester-info",
      title: "Choose Your Semester",
      component: SemesterForm,
      completed: stepCompletion["semester-info"],
    },
    {
      id: "course-form",
      title: "Add Your Courses",
      component: CourseForm,
      completed: stepCompletion["course-form"],
    },
    {
      id: "user-preferences",
      title: "User Preferences",
      component: UserPrefrenceForm,
      completed: stepCompletion["user-preferences"],
    },
  ];

  // Update step completion when child components trigger signals
  const handleStepCompletion = (stepId, isCompleted) => {
    setStepCompletion((prev) => ({
      ...prev,
      [stepId]: isCompleted,
    }));
  };







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

  const CurrentStepComponent = steps[currentStep].component;


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
              {steps[currentStep].completed ? "✔" : "⏳"} {steps[currentStep].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CurrentStepComponent
              semester={selectedSemester}
              setSemester={setSelectedSemester}
              level={selectedLevel}
              setLevel={setSelectedLevel}
              onFormComplete={(isCompleted) =>
                handleStepCompletion(steps[currentStep].id, isCompleted)
              }


            />

            {/* Navigation Buttons */}
            <div className="navigation-buttons">
              <Button
                variant="outline"
                onClick={goToPreviousStep}
                disabled={currentStep === 0}
                className="nav-button prev-button"
              >
                <ArrowLeft className="nav-icon" />
                Previous
              </Button>

              <Button
                onClick={goToNextStep}
                disabled={!steps[currentStep].completed}
                className="nav-button next-button"
              >
                Next
                <ArrowRight className="nav-icon" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Completion Message */}
      </div>
    </div>
  );
};

export default MultiStepFormTracker;
