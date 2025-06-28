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
} from "../components/ui/Select";
import "../Styles/SemesterForm.css";

export default function SemesterForm({
  setSemester,
  setLevel,
  onFormComplete,
}) {
  const { semesters } = useContext(userContext);

  useEffect(() => {
    const isCompleted = Boolean(setSemester && setLevel);
    onFormComplete(isCompleted);
  }, [setSemester, setLevel, onFormComplete]);

  return (
    <div className="semester-form__container">
      <Card className="semester-form__card">
        <CardHeader>
          <CardTitle className="semester-form__title">Semester Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form noValidate className="semester-form__form">
            {/* Semester Selection */}
            <div className="semester-form__form-group">
              <Label className="semester-form__label">Semester</Label>
              <Select
                onValueChange={(value) => {
                  const [semesterType, semesterId] = value.split(",");
                  setSemester && setSemester({ semesterType, semesterId });
                }}
              >
                <SelectTrigger className="semester-form__select-trigger">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent className="semester-form__select-content">
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
            <div className="semester-form__form-group">
              <Label className="semester-form__label">Academic Level</Label>
              <Select onValueChange={(value) => setLevel && setLevel(value)}>
                {" "}
                {/* Only call setLevel if it exists */}
                <SelectTrigger className="semester-form__select-trigger">
                  <SelectValue placeholder="Select academic level" />
                </SelectTrigger>
                <SelectContent className="semester-form__select-content">
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
