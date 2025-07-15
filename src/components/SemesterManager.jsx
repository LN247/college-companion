import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/Table";
import { useAdmin } from "../context/AdminContext";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import axios from "axios";
import "../Styles/SemesterManager.css";
import { format } from "date-fns";
import {API_BASE} from "../consatants/Constants";
import {getCookie} from "../utils/getcookies";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';

const SemesterManager = () => {





    const csrfToken=getCookie('csrftoken');

  const { semesters, addSemester, updateSemester, deleteSemester } = useAdmin([]);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    year: new Date().getFullYear(),
    start_date: "",
    end_date: "",
    semester_type: 'Fall'
  });


  const resetForm = () => {
    setFormData({
      name: "",
      year: new Date().getFullYear(),
      start_date: "",
      end_date: "",
    });
    setEditingSemester(null);
  };





  const handleSubmit = async (e) => {
    e.preventDefault();

         // Format dates to 'YYYY-MM-DD'
    const formattedFormData = {
      ...formData,
      start_date: formData.start_date ? format(new Date(formData.start_date), 'yyyy-MM-dd') : null,
      end_date: formData.end_date ? format(new Date(formData.end_date), 'yyyy-MM-dd') : null,
    };


    try {
      let response;
      if (editingSemester) {
        // Update semester in backend
        response = await axios.patch(
          `${API_BASE}/semesters/${editingSemester.id}`,
          formattedFormData
        );
        updateSemester(editingSemester.name, formattedFormData);
        toast({
          title: "Semester updated",
          description: "The semester has been successfully updated.",
        });
      } else {
        // Add semester to backend
        response = await axios.post(`${API_BASE}/semesters-operation/`, formattedFormData, {
            headers: {'X-CSRFToken': csrfToken},
            withCredentials: true
        });
        const newSemester = response.data;
        addSemester(newSemester);
        toast({
          title: "Semester added",
          description: "The new semester has been successfully created.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleDelete = async (semester) => {
    try {
      console.log('Deleting semester with id:', semester.id);
      await axios.delete(`${API_BASE}/semesters-operation/${semester.id}/`);
      deleteSemester(semesters.find((semester) => semester.id === id));
      toast({
        title: "Semester deleted",
        description:
          "The semester and its associated courses have been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (semester) => {


    setEditingSemester(semester);
    setFormData({
      name: semester.name,
      year: semester.year,
      start_date: semester.start_date,
      end_date: semester.end_date,
    });

    setIsDialogOpen(true);
  };




  return (
    <Card>
      <CardHeader className="semester-manager__card-header">
        <CardTitle className="semester-manager__card-title">Semester Management</CardTitle>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="semester-manager__add-btn">
              <Plus className="semester-manager__icon-small" />
              Add Semester
            </Button>
          </DialogTrigger>
          <DialogContent className="semester-manager__dialog-content">
            <DialogHeader className="semester-manager__dialog-header">
              <DialogTitle className="semester-manager__dialog-title">
                {editingSemester ? "Edit Semester" : "Add New Semester"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="semester-manager__form">
              <div className="semester-manager__form-group">
                <Label htmlFor="name" className="semester-manager__label">
                  Semester Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Fall 2024"
                  required
                  className="semester-manager__input"
                />
              </div>

              <div className="semester-manager__form-group">
                <Label htmlFor="year" className="semester-manager__label">
                  Year
                </Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: parseInt(e.target.value) })
                  }
                  required
                  className="semester-manager__input"
                />
              </div>


              <div className="course-manager__form-group">
                  <Label htmlFor="semester">Semester</Label>
                  <Select value={formData.semester_type} onValueChange={(value) => setFormData({...formData, semester_type:value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='Fall' >Fall</SelectItem>
                         <SelectItem value='Spring' >Spring</SelectItem>
                         <SelectItem value='Fall' >Summer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              <div className="semester-manager__form-grid-2">
                <div className="semester-manager__form-group">
                  <Label htmlFor="startDate" className="semester-manager__label">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    required
                    className="semester-manager__input"
                  />
                </div>

                <div className="semester-manager__form-group">
                  <Label htmlFor="endDate" className="semester-manager__label">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                    required
                    className="semester-manager__input"
                  />
                </div>
              </div>

              <div className="semester-manager__form-actions">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="semester-manager__button-cancel"
                >
                  Cancel
                </Button>
                <Button type="submit" className="semester-manager__button-submit">
                  {editingSemester ? "Update" : "Create"} Semester
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="semester-manager__card-content">
        <Table className="semester-manager__table">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {semesters.map((semester) => (
              <TableRow key={semester.id}>
                <TableCell className="semester-manager__table-cell font-medium">
                  {semester.name}
                </TableCell>
                <TableCell className="semester-manager__table-cell">
                  {semester.year}
                </TableCell>
                <TableCell className="semester-manager__table-cell">
                  {new Date(semester.start_date).toLocaleDateString()}
                </TableCell>
                <TableCell className="semester-manager__table-cell">
                  {new Date(semester.end_date).toLocaleDateString()}
                </TableCell>
                <TableCell className="semester-manager__table-cell">
                  <span
                    className={`status-badge ${
                      semester.is_active ? true : false
                    }`}
                  >
                    {semester.is_active ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell className="semester-manager__table-cell">
                  <div className="semester-manager__action-buttons">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(semester)}
                      className="semester-manager__button-edit"
                    >
                      <Edit className="semester-manager__icon-small" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(semester)}
                      className="semester-manager__button-delete"
                    >
                      <Trash2 className="semester-manager__icon-small" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SemesterManager;
