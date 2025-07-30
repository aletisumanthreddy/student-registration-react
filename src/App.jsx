import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Layout from './components/Layout'
import CourseTypes from './components/CourseTypes'
import Courses from './components/Courses'
import Offerings from './components/Offerings'
import Registrations from './components/Registrations'
import { useStore } from './state/Store'

function Dashboard() {
  const { state } = useStore()
  return (
    <div className="grid">
      <div className="card">
        <h2>Welcome to the Student Registration System</h2>
        <p>This application allows you to manage course types, courses, offerings, and student registrations.</p>
        <p>Use the links below to get started:</p>
        <p className="muted">Data is not saved to a server and will be lost if you refresh the page.</p>
        <p className="muted">To persist data, use the browser's localStorage feature.</p>  
        <p className="muted">All data is stored locally in your browser using localStorage.</p>
        <div className="actions" style={{marginTop:8}}>
          <Link to="/course-types"><button className="primary">Add Course Types</button></Link>
          <Link to="/courses"><button className="primary">Add Courses</button></Link>
          <Link to="/offerings"><button className="primary">Add Offerings</button></Link>
          <Link to="/registrations"><button className="primary">Register Students</button></Link>
        </div>
      </div>
      <div className="grid-2">
        <div className="card">
          <h4>Summary</h4>
          <div className="grid">
            <div className="chip">Course Types: {state.courseTypes.length}</div>
            <div className="chip">Courses: {state.courses.length}</div>
            <div className="chip">Offerings: {state.offerings.length}</div>
            <div className="chip">Registrations: {state.registrations.length}</div>
          </div>
        </div>
        <div className="card">
          <h4>Tips</h4>
          <ul>
            <li>Names must be unique; duplicates are prevented.</li>
            <li>Deleting a course or type will also remove linked offerings and registrations.</li>
            <li>Use the filter on the Registrations page to show offerings by course type.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/course-types" element={<CourseTypes />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/offerings" element={<Offerings />} />
        <Route path="/registrations" element={<Registrations />} />
      </Routes>
    </Layout>
  )
}
