import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Layout({ children }) {
  return (
    <div className="container">
      <header className="appbar">
        <div className="brand">🎓 Student Registration</div>
        <nav className="tabs">
          <NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink>
          <NavLink to="/course-types" className={({isActive}) => isActive ? 'active' : ''}>Course Types</NavLink>
          <NavLink to="/courses" className={({isActive}) => isActive ? 'active' : ''}>Courses</NavLink>
          <NavLink to="/offerings" className={({isActive}) => isActive ? 'active' : ''}>Course Offerings</NavLink>
          <NavLink to="/registrations" className={({isActive}) => isActive ? 'active' : ''}>Registrations</NavLink>
        </nav>
      </header>
      <div className="panel">
        {children}
      </div>
    </div>
  )
}
