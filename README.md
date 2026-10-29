# QuickNotes System Design

## Overview

QuickNotes is a simple note-taking application created to practise frontend API requests and backend system design.

The frontend uses the JSONPlaceholder practice API to demonstrate loading, creating, and deleting notes. The design documents describe how a real QuickNotes backend could be built using REST APIs, a relational database, and a scalable system architecture.

**Important:** JSONPlaceholder is a practice API. Created and deleted data is not permanently stored, so the frontend demonstration does not represent a complete production backend.

## Description

QuickNotes System Design is a project demonstrating a browser-based
API client and the design of a scalable online note-taking service.

The client uses HTML, CSS and JavaScript to retrieve, create and
delete notes through the JSONPlaceholder practice API.

The documentation describes the REST API, relational data model and
proposed architecture for a real service designed for one million
registered users.

## Features

- Load and display notes from an API.
- Create a note using a form.
- Delete a note from the displayed list.
- Show loading, success, and error messages.
- Validate the note title.
Display loading, success, error and empty states.
- Handle failed HTTP requests.
- Render note text safely with textContent.
- Document a proposed REST API.
- Design a relational database for users, notes, and tags.
- Describe a scalable backend architecture.

## Project Structure

```text
quicknotes-system-design/
├── index.html
├── api.js
├── style.css
├── README.md
└── docs/
    ├── api-design.md
    ├── data-model.md
    └── architecture.md
```

### Requirements

- A modern web browser.
- An internet connection.
- A code editor, such as Visual Studio Code.
- The Live Server extension for VS Code.
- An internet connection is required for API requests.

## How to Run the Frontend

1. Download or clone this repository from GitHub.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` using the VS Code Live Server extension.
4. Click **Load notes** to retrieve notes from JSONPlaceholder.
5. Use the form to create a note and the Delete buttons to remove notes from the displayed list.

## Design Documents

- [API Design](docs/api-design.md) — REST endpoints, request and response examples, and error handling.
- [Data Model](docs/data-model.md) — database entities, relationships, SQL table definitions, queries, and indexes.
- [Architecture](docs/architecture.md) — requirements, traffic estimates, architecture diagram, request flows, and trade-offs.

## What I Learned

1. **Frontend API requests:** How to use JavaScript `fetch()` and handle successful and unsuccessful HTTP responses.
2. **Asynchronous operations:** How to use `async` and `await`, show loading states, and disable buttons while requests are running.
3. **REST API design:** How HTTP methods and status codes represent operations such as retrieving, creating, updating, and deleting resources.
4. **Database design:** How primary keys, foreign keys, relationships, indexes, and SQL JOINs help organize application data.
5. **System architecture:** How load balancers, caches, read replicas, queues, and workers can support a growing application.
6. **Input validation:** How to validate input and handle loading, success and error states.
7. **Git Commit:** How Git commits track development work.

## Technologies Used

- HTML
- CSS
- JavaScript
- JSONPlaceholder
- Markdown
- SQL and PostgreSQL design concepts

## Limitations

This project does not implement a real backend, authentication, or a production database. 

A production service would
require a backend, authentication, persistent storage, authorization,
monitoring and operational safeguards.

The API and architecture documents describe a proposed design rather than deployed services.

That is, the client uses a public practice API and keeps simulated changes only in its current browser session.

## Author

Student project for the QuickNotes System Design assignment.
