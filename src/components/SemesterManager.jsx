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

const SemesterManager = () => {


   function getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
          let cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }


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
        response = await axios.put(
          `http://127.0.0.1:8000/api/semesters/${editingSemester.id}`,
          formattedFormData
        );
        updateSemester(editingSemester.name, formattedFormData);
        toast({
          title: "Semester updated",
          description: "The semester has been successfully updated.",
        });
      } else {
        // Add semester to backend
        response = await axios.post("http://127.0.0.1:8000/api/semesters-operation/", formattedFormData, {
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

  const handleDelete = async (name) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/semesters-operation/${id}/`);
      deleteSemester(name);
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
      <CardHeader className="card-header-custom">
        <CardTitle>Semester Management</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="button-add-semester">
              <Plus className="icon-small" />
              Add Semester
            </Button>
          </DialogTrigger>
          <DialogContent className="dialog-content-custom">
            <DialogHeader className="dialog-header-custom">
              <DialogTitle className="dialog-title-custom">
                {editingSemester ? "Edit Semester" : "Add New Semester"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="form-semester">
              <div className="form-group">
                <Label htmlFor="name" className="label-custom">
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
                  className="input-custom"
                />
              </div>

              <div className="form-group">
                <Label htmlFor="year" className="label-custom">
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
                  className="input-custom"
                />
              </div>


              <div className="form-group">
                <Label htmlFor="year" className="label-custom">
                  Semester Type
                </Label>
                <Input
                  id="semesterType"
                  type="select"
                  value={formData.semester_type}
                  onChange={(e) =>
                    setFormData({ ...formData,semester_type: (e.target.value) })
                  }
                  required
                  className="input-custom"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <Label htmlFor="startDate" className="label-custom">
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
                    className="input-custom"
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="endDate" className="label-custom">
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
                    className="input-custom"
                  />
                </div>
              </div>

              <div className="form-actions">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="button-cancel"
                >
                  Cancel
                </Button>
                <Button type="submit" className="button-submit">
                  {editingSemester ? "Update" : "Create"} Semester
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="card-content-custom">
        <Table className="table-custom">
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
                <TableCell className="table-cell-custom font-medium">
                  {semester.name}
                </TableCell>
                <TableCell className="table-cell-custom">
                  {semester.year}
                </TableCell>
                <TableCell className="table-cell-custom">
                  {new Date(semester.start_date).toLocaleDateString()}
                </TableCell>
                <TableCell className="table-cell-custom">
                  {new Date(semester.end_date).toLocaleDateString()}
                </TableCell>
                <TableCell className="table-cell-custom">
                  <span
                    className={`status-badge ${
                      semester.isActive ? "status-active" : "status-inactive"
                    }`}
                  >
                    {semester.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell className="table-cell-custom">
                  <div className="action-buttons">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(semester)}
                      className="button-edit"
                    >
                      <Edit className="icon-small" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(semester.id)}
                      className="button-delete"
                    >
                      <Trash2 className="icon-small" />
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
