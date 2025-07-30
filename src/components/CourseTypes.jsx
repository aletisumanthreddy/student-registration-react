import React, { useState } from 'react'
import { useStore } from '../state/Store'

const validateName = (name) => {
  if (!name || name.trim().length === 0) return 'Name is required'
  if (name.trim().length < 2) return 'Name must be at least 2 characters'
  if (name.trim().length > 30) return 'Name must be under 30 characters'
  return ''
}

export default function CourseTypes() {
  const { state, dispatch, isDuplicateCourseType } = useStore()
  const [name, setName] = useState('')
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const resetForm = () => {
    setName(''); setEditId(null); setError(''); setSuccess('')
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const err = validateName(name)
    if (err) return setError(err)
    if (isDuplicateCourseType(name, editId)) return setError('A course type with this name already exists.')
    if (editId) {
      dispatch({ type: 'UPDATE_COURSE_TYPE', id: editId, name: name.trim() })
      setSuccess('Course type updated.')
    } else {
      dispatch({ type: 'ADD_COURSE_TYPE', name: name.trim() })
      setSuccess('Course type added.')
    }
    setError('')
    setName('')
    setEditId(null)
    setTimeout(() => setSuccess(''), 1500)
  }

  const onEdit = (ct) => { setEditId(ct.id); setName(ct.name); setError(''); setSuccess('') }
  const onDelete = (id) => {
    if (confirm('Delete this course type? Any linked offerings and registrations will be removed.')) {
      dispatch({ type: 'DELETE_COURSE_TYPE', id })
    }
  }

  return (
    <div className="grid-2">
      <div className="card">
        <h3>{editId ? 'Update Course Type' : 'Add Course Type'}</h3>
        <form onSubmit={onSubmit} className="grid">
          <div>
            <label>Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Individual" />
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
          </div>
          <div className="actions">
            <button className="primary" type="submit">{editId ? 'Update' : 'Create'}</button>
            {editId && <button type="button" className="ghost" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
        <p className="muted">Examples: Individual, Group, Special</p>
      </div>
      <div className="card">
        <h3>Existing Course Types</h3>
        {state.courseTypes.length === 0 ? <p className="muted">No course types yet.</p> : (
          <div className="grid">
            {state.courseTypes.map(ct => (
              <div key={ct.id} className="actions" style={{justifyContent:'space-between'}}>
                <div className="chip">#{ct.id} • {ct.name}</div>
                <div className="actions">
                  <button onClick={() => onEdit(ct)}>Edit</button>
                  <button className="danger" onClick={() => onDelete(ct.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
