import React, { useState } from 'react'
import { useStore } from '../state/Store'

const validateName = (name) => {
  if (!name || name.trim().length === 0) return 'Name is required'
  if (name.trim().length < 2) return 'Name must be at least 2 characters'
  if (name.trim().length > 30) return 'Name must be under 30 characters'
  return ''
}

export default function Courses() {
  const { state, dispatch, isDuplicateCourse } = useStore()
  const [name, setName] = useState('')
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const resetForm = () => { setName(''); setEditId(null); setError(''); setSuccess('') }

  const onSubmit = (e) => {
    e.preventDefault()
    const err = validateName(name)
    if (err) return setError(err)
    if (isDuplicateCourse(name, editId)) return setError('A course with this name already exists.')
    if (editId) {
      dispatch({ type: 'UPDATE_COURSE', id: editId, name: name.trim() })
      setSuccess('Course updated.')
    } else {
      dispatch({ type: 'ADD_COURSE', name: name.trim() })
      setSuccess('Course added.')
    }
    setError('')
    setName('')
    setEditId(null)
    setTimeout(() => setSuccess(''), 1500)
  }

  const onEdit = (c) => { setEditId(c.id); setName(c.name); setError(''); setSuccess('') }
  const onDelete = (id) => {
    if (confirm('Delete this course? Any linked offerings and registrations will be removed.')) {
      dispatch({ type: 'DELETE_COURSE', id })
    }
  }

  return (
    <div className="grid-2">
      <div className="card">
        <h3>{editId ? 'Update Course' : 'Add Course'}</h3>
        <form onSubmit={onSubmit} className="grid">
          <div>
            <label>Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g., English" />
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
          </div>
          <div className="actions">
            <button className="primary" type="submit">{editId ? 'Update' : 'Create'}</button>
            {editId && <button type="button" className="ghost" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
        <p className="muted">Examples: Hindi, English, Urdu</p>
      </div>
      <div className="card">
        <h3>Existing Courses</h3>
        {state.courses.length === 0 ? <p className="muted">No courses yet.</p> : (
          <div className="grid">
            {state.courses.map(c => (
              <div key={c.id} className="actions" style={{justifyContent:'space-between'}}>
                <div className="chip">#{c.id} • {c.name}</div>
                <div className="actions">
                  <button onClick={() => onEdit(c)}>Edit</button>
                  <button className="danger" onClick={() => onDelete(c.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
