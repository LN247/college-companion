import requests
import os

def test_exam_slip_processing():
    # Get the current directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Path to your exam slip image
    image_path = os.path.join(current_dir, 'sample_exam_slip.jpg')
    
    # API endpoint
    url = 'http://localhost:8000/api/process-exam-slip/'
    
    try:
        # Open and send the image
        with open(image_path, 'rb') as img_file:
            files = {'exam_slip': ('sample_exam_slip.jpg', img_file, 'image/jpeg')}
            response = requests.post(url, files=files)
        
        # Print the results
        print("\nStatus Code:", response.status_code)
        print("\nResponse:", response.json())
        
    except FileNotFoundError:
        print(f"\nError: Could not find the image file at {image_path}")
        print("Make sure to save your exam slip image as 'sample_exam_slip.jpg' in the backend directory")
    except requests.exceptions.ConnectionError:
        print("\nError: Could not connect to the server at", url)
        print("Make sure the Django server is running (python manage.py runserver)")
    except Exception as e:
        print("\nError:", str(e))

if __name__ == "__main__":
    test_exam_slip_processing() 