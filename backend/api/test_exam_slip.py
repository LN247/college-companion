import cv2
import numpy as np
import requests
import os

def create_test_image():
    # Create a white background
    img = np.zeros((800, 600), dtype=np.uint8)
    img.fill(255)  # White background

    # Add some text to simulate an exam slip
    cv2.putText(img, "EXAMINATION RESULTS", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 0), 2)
    cv2.putText(img, "Mathematics: A", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 0), 2)
    cv2.putText(img, "Physics: B+", (50, 150), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 0), 2)
    cv2.putText(img, "Chemistry: A-", (50, 200), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 0), 2)
    cv2.putText(img, "Biology: B", (50, 250), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 0), 2)
    cv2.putText(img, "Computer Science: A+", (50, 300), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 0), 2)

    # Save the image
    cv2.imwrite('test_exam_slip.png', img)
    return 'test_exam_slip.png'

def test_exam_slip_processing():
    # Create test image
    image_path = create_test_image()
    
    # Prepare the request
    url = 'http://localhost:8000/api/process-exam-slip/'
    files = {'exam_slip': open(image_path, 'rb')}
    
    try:
        # Send the request
        response = requests.post(url, files=files)
        
        # Print the response
        print("Status Code:", response.status_code)
        print("Response:", response.json())
        
    except Exception as e:
        print("Error:", str(e))
    finally:
        # Clean up
        if os.path.exists(image_path):
            os.remove(image_path)

if __name__ == "__main__":
    test_exam_slip_processing() 