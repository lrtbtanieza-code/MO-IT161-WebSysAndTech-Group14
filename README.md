# To-Do List Web Application

## Milestone 1 – Interactive Frontend Web Application

### Project Overview

A browser-based to-do list developed for MO-IT161 by Group 14. The project began as an interactive HTML, CSS, and JavaScript application and later added a small Node.js/Express server and task API.



## Features

- Test-account login and logout
- Add, edit, complete, and delete tasks
- Search tasks and filter by status or category
- Task priorities, due dates, and overdue indicators
- Task counts and completion progress
- Responsive layout, including a mobile navigation menu
- Profile page with sample user information

The login credentials and profile details are demonstration data, not a real user-account system. Task reminders and recurring-task options are stored as task fields; this project does not send reminders or automatically create recurring tasks.

## Technologies

- HTML, CSS, and JavaScript
- Node.js and Express.js for the optional local web server and task API
- Browser `localStorage` for the task list used by the interactive UI
- `tasks.json` as storage for the separate API

## Project structure

```text
MO-IT161-WebSysAndTech-Group14/
├── addNewtask.html
├── function.js
├── login.html
├── mainPage.html
├── package.json
├── server.js
├── style.css
├── tasks.json
├── userProfile.html
└── README.md
```

## Run the application

### Recommended: use the local server

**Requirements:** Node.js and npm.

1. Open a terminal in the project directory.
2. Install the project dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   node server.js
   ```

4. Open [http://localhost:3000/login.html](http://localhost:3000/login.html) in a browser.

The server prints `Server running on http://localhost:3000` when it starts. The root URL (`http://localhost:3000/`) opens the main page directly; use `/login.html` to begin at the login screen.

### Test login

These hard-coded credentials are for demonstration only:

- **Username:** `Jeera`
- **Password:** `12345`

The app records the login state and username in browser `localStorage`. This is not secure authentication and should not be used for real accounts or sensitive data.

## Milestone 2 – Backend-Supported Web Application

### Run without Node.js

You can open `login.html` directly in a browser, but the backend API will not be available unless the server is also running. Running through the local server is recommended for consistent testing.

## Task storage and backend API

The interactive task features in `function.js` read and write tasks in the browser's `localStorage`. That data is specific to the browser and its profile; it is not automatically saved to `tasks.json`.

The Express server in `server.js` provides a separate file-backed API:

| Method and path | Behavior |
| --- | --- |
| `GET /api/tasks` | Returns the contents of `tasks.json` as JSON. If the file does not exist, the server creates it as an empty list. |
| `POST /api/tasks` | Appends the submitted JSON body to `tasks.json` and returns the saved task. |

**Integration limitation:** The frontend currently requests `GET /api/tasks` when its script loads and maps API records into its browser task format, but it does not send task additions, edits, completions, or deletions to `POST /api/tasks`. The frontend and API therefore do not share a complete persistence workflow. In particular, an empty API task list can replace the browser task list on page load while the server is running. Do not treat `tasks.json` as a backup of tasks entered through the UI.

## Project documents

- [AI Use Statement](https://docs.google.com/document/d/1W60-U1pI7PM1mPJdqAQSR1AcztEky1WkNSwsabfrFmE/edit?usp=sharing)
- [MO-IT161 Application Development Workflow Worksheet — S3101 Group 14](https://docs.google.com/spreadsheets/d/1zbliRLhrZD5pwWzjo5o24m7k7PrQYwAUvra8L4sjKsA/edit?usp=sharing)

## Team contributions

### Milestone 1

- **Irene Franco — HTML:** Created and organized the application page structures, including the main task page, add-task page, and profile page.
- **Antoneett Pelayo — CSS:** Created the initial login page and maintained the styling, layout, and responsive presentation.
- **Toni Bianca Tanieza — JavaScript:** Implemented interactive task management, filtering, search, progress updates, login, and logout.

### Milestone 2

- **Irene Franco — HTML, CSS, and documentation:** Refined page structure and layout, contributed to server setup and integration testing, and updated project documentation.
- **Toni Bianca Tanieza — JavaScript and backend:** Developed task-page interactions and configured the Express server, API routes, and `tasks.json` file storage.

The team collaborated on application planning, design decisions, implementation, testing, and project documentation. Team members discussed the work and reviewed decisions together through online meetings.

## AI usage

During development, the team used ChatGPT and Gemini for support with HTML, CSS, JavaScript, and Node.js concepts; brainstorming; troubleshooting; and reviewing possible improvements. Team members evaluated, adapted, and tested suggestions as part of their work. Refer to the linked AI Use Statement for the team's fuller disclosure.
