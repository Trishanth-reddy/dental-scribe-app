OralVis - AI Dental Annotation Platform
OralVis is a full-stack MERN application designed for dental professionals. It allows patients to upload images of their teeth for review. Administrators can then log in to a secure portal to view submissions, annotate images with professional tools, and generate comprehensive PDF reports. The entire workflow is supported by AWS S3 for robust and scalable file storage.

GitHub Repositories
Frontend: https://github.com/Trishanth-reddy/dental-scribe-app

Backend: https://github.com/Trishanth-reddy/backend-dental

Live Demo
Frontend (Vercel): https://dental-scribe-app.vercel.app

Backend (AWS/Render): https://backend-dental-uwt7.onrender.com

Features
Role-Based Authentication: Secure JWT authentication for Patient and Admin roles.

Patient Dashboard: Patients can upload new images, add notes, and view the status of all their past submissions.

Admin Dashboard: Admins can view and manage all patient submissions in one place.

Advanced Image Annotation: A powerful, in-browser tool for admins to annotate images using shapes (rectangle, circle, arrow) and a fixed color palette (Red for urgent, Yellow for caution, Blue for notes).

Dynamic PDF Report Generation: Creates professional PDF reports including patient details, side-by-side original & annotated images, a color legend, and clinical findings.

Cloud Storage: All images (original, annotated) and PDF reports are securely stored and served from AWS S3.

Tech Stack
Frontend: React, Vite, TypeScript, Fabric.js, @react-pdf/renderer, Axios, TanStack Query

Backend: Node.js, Express.js, MongoDB (with Mongoose), JWT

Storage: AWS S3 for all file uploads and hosting.

Deployment: Vercel (Frontend), AWS App Runner/Render (Backend).

Local Setup and Installation
Prerequisites
Node.js (v18 or later)

npm or yarn

MongoDB Atlas account

AWS S3 Bucket & IAM credentials

Git

1. Backend Setup
Bash

# 1. Clone the repository
git clone https://github.com/Trishanth-reddy/backend-dental
cd backend-dental

# 2. Install dependencies
npm install

# 3. Create a .env file in the root folder and add the following variables:
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
AWS_BUCKET_NAME=your-s3-bucket-name
AWS_BUCKET_REGION=your-s3-bucket-region
AWS_ACCESS_KEY=your-aws-access-key
AWS_SECRET_KEY=your-aws-secret-access-key

# 4. Start the server
npm start
2. Frontend Setup
Bash

# 1. Clone the repository in a separate directory
git clone https://github.com/Trishanth-reddy/dental-scribe-app
cd dental-scribe-app

# 2. Install dependencies
npm install

# 3. Create a .env.local file in the root folder
# This URL should point to your local backend server
VITE_API_URL=http://localhost:5001/api

# 4. Start the development server
npm run dev
The application should now be running locally at http://localhost:8080 (or another port specified by Vite).

Test Credentials
You can use these accounts to test the application's role-based features on the live demo.

Admin Account:

Email: admin@dental.com

Password: admin123

Patient Account:

Email: patient@dental.com

Password: patient123

API Documentation & Sample Requests
Authentication (/api/auth)
Method	Endpoint	Access	Description
POST	/register	Public	Creates a new patient account.
POST	/login	Public	Logs in a user, returns a JWT.
GET	/me	Private	Gets the current logged-in user.
Sample Login Request (cURL):

Bash

curl -X POST https://backend-dental-uwt7.onrender.com/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email": "patient@dental.com", "password": "patient123"}'
Submissions (/api/submissions)
Method	Endpoint	Access	Description
POST	/	Patient	Creates a new submission (file upload).
GET	/patient	Patient	Gets all submissions for the logged-in patient.
GET	/admin	Admin	Gets all submissions from all patients.
GET	/:id	Private	Gets a single submission by its ID.
PUT	/:id/review	Admin	Saves review, uploads files, generates PDF.

