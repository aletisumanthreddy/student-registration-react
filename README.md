# Student Registration (React Only)

A simple student registration system built with React (Vite) and localStorage. It supports:

- **Course Types:** Create, list, update, delete (e.g., Individual, Group, Special).
- **Courses:** Create, list, update, delete (e.g., Hindi, English, Urdu).
- **Course Offerings:** Associate a course with a course type, list, update, delete.
- **Student Registrations:** Register students into offerings, list registrations per offering, and filter offerings by course type.

## Tech
- React 18 with Vite
- React Router for navigation
- State managed with React Context + Reducer
- Persistence with `localStorage`
- Minimal CSS (no UI libraries)

## Getting Started

```bash
npm create vite@latest student-registration-react -- --template react
# (Skip the above if you're using the files in this repo)

# If using this code from scratch
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Data Model

```text
courseTypes: [{ id, name }]
courses:     [{ id, name }]
offerings:   [{ id, courseTypeId, courseId }]
registrations: [{ id, offeringId, studentName, email, phone }]
```

## Validation & Error Handling
- Names required, 2–30 chars, must be unique (case-insensitive).
- Offerings must be unique (a specific course + type pair can exist only once).
- Email format checked; phone optional with basic pattern.
- Deleting a course/type cascades to offerings and registrations.


