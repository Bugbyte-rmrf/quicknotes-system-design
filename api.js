const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadButton = document.getElementById("load-btn");
const statusMessage = document.getElementById("status");
const noteForm = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");
const submitButton = document.getElementById("submit-btn");
const notesList = document.getElementById("notes-list");

let notes = [];
let isBusy = false;

// Show a status message and assign its styling.
function showStatus(message, type = "") {
  statusMessage.textContent = message;
  statusMessage.className = type;
}

// Disable buttons while an API request is running.
function setBusy(busy) {
  isBusy = busy;
  loadButton.disabled = busy;
  submitButton.disabled = busy;

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.disabled = busy;
  });

  loadButton.textContent = busy ? "Please wait..." : "Load notes";
  submitButton.textContent = busy ? "Please wait..." : "Create note";
}

// Reusable request function for GET, POST and DELETE.
async function request(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  // Some APIs return no body for successful DELETE requests.
  if (response.status === 204) {
    return { data: null, status: response.status };
  }

  const data = await response.json();

  return {
    data,
    status: response.status
  };
}

// Create DOM elements using textContent, never user-provided HTML.
function renderNotes() {
  notesList.replaceChildren();

  if (notes.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "No notes found. Create your first note!";
    notesList.appendChild(emptyItem);
    return;
  }

  notes.forEach((note) => {
    const item = document.createElement("li");
    item.className = "note-item";

    const heading = document.createElement("h3");
    heading.textContent = note.title || "(Untitled note)";

    const body = document.createElement("p");
    body.textContent = note.body || "(No body provided)";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete note";

    deleteButton.addEventListener("click", () => {
      deleteNote(note.id);
    });

    item.append(heading, body, deleteButton);
    notesList.appendChild(item);
  });

  // If the page becomes busy, newly rendered Delete buttons
  // must also remain disabled.
  if (isBusy) {
    setBusy(true);
  }
}

// TASK 1: GET ten notes.
async function loadNotes() {
  if (isBusy) return;

  setBusy(true);
  showStatus("Loading notes...", "loading");

  try {
    const result = await request(`${API_URL}?_limit=10`);
    notes = result.data;
    renderNotes();

    if (notes.length === 0) {
      showStatus("No notes were returned by the server.", "success");
    } else {
      showStatus(
        `Loaded ${notes.length} notes from the server.`,
        "success"
      );
    }
  } catch (error) {
    console.error("Could not load notes:", error);
    showStatus(
      "Sorry, we couldn't load your notes. Please try again.",
      "error"
    );
  } finally {
    setBusy(false);
  }
}

// TASK 2: POST a new note.
async function createNote(event) {
  event.preventDefault();

  if (isBusy) return;

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (!title) {
    showStatus("Please enter a title for your note.", "error");
    titleInput.focus();
    return;
  }

  if (title.length > 100) {
    showStatus("The title must be 100 characters or fewer.", "error");
    titleInput.focus();
    return;
  }

  setBusy(true);
  showStatus("Creating your note...", "loading");

  try {
    const result = await request(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        body,
        userId: 1
      })
    });

    // JSONPlaceholder simulates creation; it does not persist
    // the new post. Keep the returned note in the local UI only.
    const newNote = result.data;
    notes = [newNote, ...notes];
    renderNotes();

    noteForm.reset();

    showStatus(
      `Note created (status ${result.status}, id ${newNote.id}).`,
      "success"
    );
  } catch (error) {
    console.error("Could not create note:", error);
    showStatus(
      "Sorry, we couldn't create your note. Please try again.",
      "error"
    );
  } finally {
    setBusy(false);
  }
}

// TASK 3: DELETE a note.
async function deleteNote(id) {
  if (isBusy) return;

  setBusy(true);
  showStatus("Deleting note...", "loading");

  try {
    await request(`${API_URL}/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });

    // JSONPlaceholder returns simulated success. Remove the note
    // from this page, but remember that the remote data is not
    // actually being changed permanently.
    notes = notes.filter((note) => note.id !== id);
    renderNotes();

    showStatus("Note deleted successfully.", "success");
  } catch (error) {
    console.error("Could not delete note:", error);
    showStatus(
      "Sorry, we couldn't delete that note. Please try again.",
      "error"
    );
  } finally {
    setBusy(false);
  }
}

// Connect the page controls to their functions.
loadButton.addEventListener("click", loadNotes);
noteForm.addEventListener("submit", createNote);
