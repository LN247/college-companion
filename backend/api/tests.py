from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from .views import ExamSlipProcessor
import cv2
import numpy as np
from PIL import Image
import io

class ExamSlipProcessorTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Create a test image with text
        img = np.zeros((100, 300), dtype=np.uint8)
        img.fill(255)  # White background
        cv2.putText(img, "Mathematics A", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 0), 2)
        cv2.putText(img, "Physics B", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 0), 2)
        
        # Convert to bytes
        _, buffer = cv2.imencode('.png', img)
        self.test_image = SimpleUploadedFile(
            "test_slip.png",
            buffer.tobytes(),
            content_type="image/png"
        )

    def test_exam_slip_processing(self):
        """Test the exam slip processing endpoint"""
        response = self.client.post(
            '/api/process-exam-slip/',  # Update this with your actual endpoint
            {'exam_slip': self.test_image},
            format='multipart'
        )
        
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['success'])
        self.assertIsInstance(response.data['subjects'], list)
        
        # Verify that our test subjects were found
        subjects = [s.lower() for s in response.data['subjects']]
        self.assertTrue(any('mathematics' in s for s in subjects))
        self.assertTrue(any('physics' in s for s in subjects))

    def test_no_image_provided(self):
        """Test the endpoint with no image"""
        response = self.client.post(
            '/api/process-exam-slip/',  # Update this with your actual endpoint
            {},
            format='multipart'
        )
        
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.data)
