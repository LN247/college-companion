import userContext from "../context/UserContext";
import { useContext, useEffect } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import "../Styles/plan.css";
export default function SemesterForm({
  setSemester,
  setLevel,
  onFormComplete,
}) {
  const { semesters } = useContext(userContext); // Get semesters from context

  useEffect(() => {
    const isCompleted = Boolean(setSemester && setLevel);
    onFormComplete(isCompleted); // Notify parent component with current state
  }, [setSemester, setLevel, onFormComplete]);

  return (
    <div className="semester-course-container">
      <Card className="semester-card">
        <CardHeader>
          <CardTitle>Semester Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form noValidate className="course-form">
            {/* Semester Selection */}
            <div className="form-group">
              <Label>Semester</Label>
              <Select
                onValueChange={(value) => {
                  const [semesterType, semesterId] = value.split(","); // Extract type and id
                  setSemester && setSemester({ semesterType, semesterId }); // Send as object
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((semester) => (
                    <SelectItem
                      key={semester.id}
                      value={`${semester.semester_type},${semester.id}`}
                    >
                      {semester.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Academic Level Selection */}
            <div className="form-group">
              <Label>Academic Level</Label>
              <Select onValueChange={(value) => setLevel && setLevel(value)}>
                {" "}
                {/* Only call setLevel if it exists */}
                <SelectTrigger>
                  <SelectValue placeholder="Select academic level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Freshman">Freshman</SelectItem>
                  <SelectItem value="Sophomore">Sophomore</SelectItem>
                  <SelectItem value="Junior">Junior</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                  <SelectItem value="Master">Master</SelectItem>
                  <SelectItem value="PhD">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
