import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/Dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { useAdmin } from '../context/AdminContext';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import {getCookie} from "../utils/getcookies";
import '../Styles/CourseManager.css';
import axios from "axios";

const CourseManager = () => {

  const { Courses, addCourse, updateCourse, deleteCourse } = useAdmin();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const csrfToken=getCookie('csrftoken');



  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: 3,
    academicLevel: 'Freshman L1',
    semester: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      credits: 3,
      academicLevel: 'Freshman L1',
      semester: ''
    });
    setEditingCourse(null);
  };
  let response;
  const handleSubmit = async (e) => {
    e.preventDefault();

     response = await axios.patch(`http://localhost/api/courses/${courses.id}/`, FormData, {
            headers: {'X-CSRFToken': csrfToken},
            withCredentials: true
        });

    if (editingCourse) {
      updateCourse(editingCourse.id, response.data);
      toast({
        title: "Course updated",
        description: "The course has been successfully updated."
      });
    } else {

        response = await axios.post("http://localhost:8000/api/courses/", FormData, {
            headers: {'X-CSRFToken': csrfToken},
            withCredentials: true
        });

      addCourse(response.data);
      toast({
        title: "Course added",
        description: "The new course has been successfully created."
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      code: course.code,
      credits: course.credits,
      academicLevel: course.level,
      semester: course.semester,
    });
    setIsDialogOpen(true);
  };

  const handleDelete =async (id) => {

      response = await axios.delete(`http://localhost:8000/api/courses/${id}/`, FormData, {
            headers: {'X-CSRFToken': csrfToken},
            withCredentials: true
        });
    deleteCourse(id);
    toast({
      title: "Course deleted",
      description: "The course has been successfully removed."
    });
  };


  const getLevelColor = (level) => {
    switch (level) {
      case 'Freshman ':
        return 'level-badge level-freshman';
      case 'Sophomore ':
        return 'level-badge level-sophomore';
      case 'Junior ':
        return 'level-badge level-junior';
      case 'Senior ':
        return 'level-badge level-senior';
      case 'Master':
        return 'level-badge level-master';
      case 'PhD':
        return 'level-badge level-phd';
      default:
        return 'level-badge level-default';
    }
  };

  return (
    <Card className="course-manager-card">
      <CardHeader className="course-manager-header">
        <CardTitle>Course Management</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="add-course-btn" onClick={resetForm}>
              <Plus className="icon add-icon" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="course-dialog">
            <DialogHeader>
              <DialogTitle>
                {editingCourse ? 'Edit Course' : 'Add New Course'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="course-form">
              <div className="form-grid">
                <div className="form-group">
                  <Label htmlFor="name">Course Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Introduction to Computer Science"
                    required
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="code">Course Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    placeholder="e.g., CS101"
                    required
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="credits">Credits</Label>
                  <Input
                    id="credits"
                    type="number"
                    min="1"
                    max="6"
                    value={formData.credits}
                    onChange={(e) => setFormData({...formData, credits: parseInt(e.target.value)})}
                    required
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="level">Academic Level</Label>
                  <Select value={formData.academicLevel} onValueChange={(value) => setFormData({...formData, level: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Freshman">Freshman </SelectItem>
                      <SelectItem value="Sophomore">Sophomore </SelectItem>
                      <SelectItem value="Junior ">Junior </SelectItem>
                      <SelectItem value="Senior">Senior </SelectItem>
                      <SelectItem value="Master">Master</SelectItem>
                      <SelectItem value="PhD">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="form-group">
                  <Label htmlFor="semester">Semester</Label>
                  <Select value={formData.semester} onValueChange={(value) => setFormData({...formData, semesterId: value})}>
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


              </div>

              <div className="form-actions">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCourse ? 'Update' : 'Create'} Course
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <Table className="courses-table">
          <TableHeader>
            <TableRow>
              <TableHead>Course Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Academic Level</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Courses && Courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="course-code">{course.code}</TableCell>
                <TableCell className="course-name">{course.name}</TableCell>
                <TableCell className="course-credits">{course.credits}</TableCell>
                <TableCell className="course-level">
                  <span className={getLevelColor(course.academicLevel)}>
                    {course.academicLevel}
                  </span>
                </TableCell>
                <TableCell className="course-semester">{course.semester}</TableCell>
                <TableCell className="course-actions">
                  <div className="action-buttons">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(course)}
                      className="edit-btn"
                    >
                      <Edit className="icon edit-icon" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(course.id)}
                      className="delete-btn"
                    >
                      <Trash2 className="icon delete-icon" />
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

export default CourseManager;