# To-Do List Web Application

## Milestone 1 – Interactive Frontend Web Application

### Project Overview

Our project is a browser-based **To-Do List** application designed to help users organize, manage, and track their daily tasks.

The application is intended for students, teachers, employees, business professionals, and anyone who wants to stay organized and productive.

For **Milestone 1**, the project focuses on developing an **Interactive Frontend Web Application** using HTML, CSS, and JavaScript.

---

## Milestone 1 – Scope

The frontend application provides a simple, clean, and user-friendly interface for managing tasks.

### Current Features

- Welcome section with user name
- Search tasks
- Add new tasks
- Edit tasks
- Delete tasks
- Task categories
- Task priorities
- Due dates
- Completed and pending tasks
- Task filtering
- Overall progress bar
- Task summary
- Overdue task indicator
- Notification area
- User profile
- Sidebar navigation
- Responsive layout

---

## Frontend Technologies

- **HTML** — Defines the structure and content of the application.
- **CSS** — Controls the layout, design, colors, spacing, and appearance.
- **JavaScript** — Provides interactive functionality and dynamic task management.

---

---

## Milestone 2 – Backend Integration & Full-Stack Expansion

Building upon the interactive frontend interface developed in Milestone 1, **Milestone 2** transitions the project into a **Full-Stack Web Application**.

While Milestone 1 handled task management exclusively on the client side, Milestone 2 introduces a dedicated backend server (`server.js`) built with **Node.js** and **Express.js**, along with local data persistence using `tasks.json`.

### Key Milestone 2 Upgrades

- **Node.js & Express Server:** Created a backend server to handle incoming requests on port `3000`.
- **RESTful API Endpoints:** Implemented `GET`, `POST`, `PUT`, and `DELETE` routes to manage task state dynamically.
- **Asynchronous Data Fetching:** Refactored `function.js` using the standard JavaScript `Fetch API` to connect DOM user interactions directly to backend routes.
- **JSON Data Persistence:** Added `tasks.json` so task records remain intact across page reloads and browser sessions.

---

## Terminal Assessment – Testing, Refinement & Walkthrough

The project has completed its final validation phase, incorporating internal quality checks and feedback from external partner testing to ensure ownership, stability, and usability.

### Testing & Quality Assurance Summary

1. **Internal Testing (Homework 8):** Verified core functional workflows including form validation, API endpoint responses (`200 OK`, `201 Created`), and DOM updates.
2. **External Partner Testing (Homework 9):** Partner team conducted peer evaluations on usability and UI feedback. Key improvements implemented included immediate DOM updates upon task deletion and real-time progress bar recalculations.
3. **Revision & Refinement:** Logged all post-testing adjustments and updates in Tab 4 (*Revision and Improvement Summary*) of the project workbook.
4. **Validation Walkthrough:** Recorded a video walkthrough covering application architecture, system data flow, project planning adjustments, testing interpretations, and decision-making justifications.

---

## Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6+ / Fetch API)
- **Backend:** Node.js, Express.js, CORS, body-parser
- **Data Persistence:** JSON (`tasks.json`)
- **Development Tools:** VS Code, Git / GitHub, Postman / Curl

---

## Current Project Structure

```text
To-Do-List/
│
├── login.html
├── mainPage.html
├── addNewtask.html
├── userProfile.html
├── style.css
├── function.js
├── server.js
└── package.json
```

## Project Documents

- [AI Use Statement](https://docs.google.com/document/d/1W60-U1pI7PM1mPJdqAQSR1AcztEky1WkNSwsabfrFmE/edit?usp=sharing)
- [MO-IT161 | Application Development Workflow Worksheet | S3101 - GROUP 14](https://docs.google.com/spreadsheets/d/1zbliRLhrZD5pwWzjo5o24m7k7PrQYwAUvra8L4sjKsA/edit?usp=sharing)

  
---
## How to Run the Project

1. Download or clone the project repository.
2. Open the `login.html` file.
3. Run or open `login.html` using a web browser.
4. Log in using the test account below.
5. After successful login, the application will redirect to the main To-Do List page.

### Test Login Credentials

> **For testing purposes only**

- **Username:** `Jeera`
- **Password:** `12345`

---

## Team Responsibilities

Our team consists of three members. The frontend development work was divided according to the main technologies used in the project.

### Irene Franco – HTML

Responsible for:

- Creating the HTML structure of the application
- Developing the main task page
- Developing the Add New Task page
- Developing the User Profile page
- Organizing the webpage elements and forms

### Antoneett Pelayo – CSS

Responsible for:

- Creating and maintaining the `style.css` file
- Developing the initial login page
- Making the initial Git commit and setting up the project repository
- Designing the overall application layout
- Styling buttons, task cards, forms, badges, and navigation
- Applying colors, spacing, fonts, and visual formatting
- Improving the consistency and user-friendliness of the interface
- Implementing responsive styling for different screen sizes


### Toni Bianca Tanieza – JavaScript

Responsible for:

- Creating and maintaining the `function.js` file
- Implementing interactive task functionality
- Add Task functionality
- Edit Task functionality
- Delete Task functionality
- Complete/Uncomplete Task functionality
- Task filtering and category filtering
- Search functionality
- Overdue task detection
- Progress and task summary updates
- Login and logout functionality

---

## Team Collaboration

Although the main frontend tasks were divided among the three members, the project was developed through **team collaboration**.

The team discussed the application's structure, design, functionality, and implementation through **Google Meet**. Members shared ideas, reviewed each other's work, discussed problems encountered during development, and made decisions together when changes affected the overall application.

The **workflow worksheet and AI usage documentation were also completed as a team effort**, with members discussing and reviewing the information together through Google Meet.

---

## AI Usage

ChatGPT was used as a support tool during development to:

- Understand HTML, CSS, and JavaScript concepts
- Brainstorm ideas for application features and design
- Troubleshoot and debug code
- Review and improve code
- Suggest alternative implementations
- Improve the organization and clarity of the project
- Support the development of interactive functionality

The code was **developed and assembled by the team** based on our project requirements and understanding of HTML, CSS, and JavaScript. AI suggestions were used only as guidance and support during development.

The team reviewed, tested, modified, and implemented the code ourselves. We did not simply copy and submit AI-generated code without understanding or testing it. We made our own decisions regarding the application's structure, styling, functionality, and user interface.

All final code was tested by the team to ensure that the implemented features worked according to the project requirements.
