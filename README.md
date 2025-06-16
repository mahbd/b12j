# B12J - Online Judge Platform

B12J is a comprehensive online judge platform designed for hosting programming contests and practicing problem-solving. It provides a robust environment for users to submit solutions, get them judged, and participate in contests.

## Features

- **Contest Management:**
  - Create and manage programming contests with specified start and end times.
  - Add problems to contests with individual scoring and time limits.
  - Define writers and testers for contests.
- **Problem Management:**
  - Create and manage a library of programming problems.
  - Support for multiple programming languages (C/C++, Python, TypeScript, Kotlin).
  - Define time and memory limits for each problem.
  - Add test cases with input and expected output.
  - Option to include a checker function for custom validation.
- **Submission System:**
  - Users can submit solutions to problems in various languages.
  - Real-time judging of submissions with verdicts like Accepted (AC), Wrong Answer (WA), Time Limit Exceeded (TLE), etc.
  - Detailed submission history for users.
- **User Authentication:**
  - User registration and login.
  - Google OAuth for quick and secure login.
  - JWT-based authentication for API access.
- **Real-time Updates:**
  - WebSockets for real-time updates on contest standings, new submissions, and problem discussions.
- **Tutorials and Discussions:**
  - Create tutorials for problems.
  - Comment section for discussions on problems.
- **Standings:**
  - Live contest standings.
  - Separate standings for during and after the contest.
- **Admin Interface:**
  - Django admin panel for managing users, contests, problems, and other platform data.
- **API:**
  - RESTful API for interacting with the platform programmatically.

## Usage

### Prerequisites

- Python 3.12.1
- Node.js 16.20.2
- PostgreSQL (or other Django-compatible database)
- Judge0 for code execution (can be self-hosted or a cloud instance)

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd b12j
    ```
2.  **Backend Setup:**
    - Create and activate a Python virtual environment:
      ```bash
      python -m venv venv
      source venv/bin/activate  # On Windows: venv\Scripts\activate
      ```
    - Install Python dependencies:
      ```bash
      pip install -r requirements.txt
      ```
    - Configure database settings in `b12j/settings.py`.
    - Set up environment variables for Judge0 URL and API Key, Firebase Admin SDK, etc. (refer to `.env.example` if provided, or create one).
    - Run database migrations:
      ```bash
      python manage.py migrate
      ```
    - Create a superuser:
      ```bash
      python manage.py createsuperuser
      ```
3.  **Frontend Setup:**
    - Navigate to the frontend directory:
      ```bash
      cd b12j-front
      ```
    - Install Node.js dependencies:
      ```bash
      npm install
      ```
4.  **Running the Application:**
    - **Backend (Development):**
      ```bash
      python manage.py runserver
      ```
      The Django development server will typically run on `http://127.0.0.1:8000/`.
    - **Frontend (Development):**
      In the `b12j-front` directory:
      ```bash
      npm start
      ```
      The React development server will typically run on `http://localhost:3000/`.
    - **Production:**
      The `Procfile` suggests using Daphne for ASGI applications:
      ```
      web: daphne b12j.asgi:application --port $PORT --bind 0.0.0.0 -v2
      ```
      For the frontend, build the static assets:
      ```bash
      cd b12j-front
      npm run build
      ```
      Configure your web server (e.g., Nginx) to serve the Django backend and the static frontend files from `b12j-front/build/`.

## API Endpoints

The platform exposes a RESTful API for various functionalities. Key API endpoints are managed under the `/api/` path.

- **Authentication:**
  - `api/auth/jwt/create/`: Obtain JWT token.
  - `api/auth/o/complete/<provider>/`: OAuth completion (e.g., Google).
  - `api/auth/google/token/`: Google login.
  - `api/auth/users/`: User management (Djoser).
- **Contests:** `api/contests/`
- **Problems:** `api/problems/`
- **Submissions:** `api/submissions/`
- **Comments:** `api/problems/<problem_id>/comments/`
- **Tutorials:** `api/tutorials/`
- **Test Cases:** `api/test-cases/`
- **Users:** `api/users/` (Read-only user information)
- **Standings:** `api/standing/<contest_id>`

Refer to `api/urls.py` for a detailed list of all available API routes.

## Technical Details

### Backend

- **Framework:** Django (Python)
- **API:** Django REST framework
- **Real-time Communication:** Django Channels (WebSockets)
- **Authentication:** Djoser (for JWT), Social Auth App Django (for OAuth)
- **Database:** Configured for PostgreSQL (using `djongo` in `requirements.txt` suggests potential MongoDB experimentation, but Django's ORM primarily targets SQL databases. The project structure indicates a relational DB focus).
- **Code Judging:** Integrates with Judge0 API for secure code execution and evaluation.
- **Asynchronous Tasks:** Django Channels for background tasks like judging submissions.

### Frontend

- **Framework:** React.js
- **State Management:** Redux (with @reduxjs/toolkit)
- **Routing:** React Router
- **HTTP Client:** Axios
- **UI Components:**
  - Quill for rich text editing.
  - React Ace for code editor.
  - React Select for enhanced select inputs.
- **Form Handling:** React Hook Form with Joi/Zod for validation.
- **Styling:** CSS, Bootstrap.
- **Build Tool:** Create React App (react-scripts)

### Key Modules/Apps

- `api/`: Handles all REST API logic.
- `judge/`: Core logic for contest, problem, submission, and judging.
- `users/`: User authentication and management.
- `ws/`: WebSocket consumers and real-time communication logic.
- `b12j-front/`: React frontend application.

This README provides a high-level overview. For more detailed information, please refer to the source code and specific documentation within each module.
