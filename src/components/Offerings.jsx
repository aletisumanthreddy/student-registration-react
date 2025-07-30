import React, { useState } from 'react'
import { useStore } from '../state/Store'

export default function Offerings() {
  const { state, dispatch, isDuplicateOffering, offeringLabel } = useStore()
  const [courseTypeId, setCourseTypeId] = useState('')
  const [courseId, setCourseId] = useState('')
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    const ctId = Number(courseTypeId)
    const cId = Number(courseId)
    if (!ctId) return setError('Please select a course type')
    if (!cId) return setError('Please select a course')
    if (isDuplicateOffering(ctId, cId, editId)) return setError('This offering already exists.')
    if (editId) {
      dispatch({ type: 'UPDATE_OFFERING', id: editId, courseTypeId: ctId, courseId: cId })
      setSuccess('Offering updated.')
    } else {
      dispatch({ type: 'ADD_OFFERING', courseTypeId: ctId, courseId: cId })
      setSuccess('Offering added.')
    }
    setError('')
    setCourseTypeId('')
    setCourseId('')
    setEditId(null)
    setTimeout(() => setSuccess(''), 1500)
  }

  const onEdit = (o) => { setEditId(o.id); setCourseTypeId(String(o.courseTypeId)); setCourseId(String(o.courseId)); setError(''); setSuccess('') }
  const onDelete = (id) => {
    if (confirm('Delete this offering? Any linked registrations will be removed.')) {
      dispatch({ type: 'DELETE_OFFERING', id })
    }
  }

  return (
    <div className="grid-2">
      <div className="card">
        <h3>{editId ? 'Update Course Offering' : 'Add Course Offering'}</h3>
        <form className="grid" onSubmit={onSubmit}>
          <div className="row">
            <div>
              <label>Course Type</label>
              <select value={courseTypeId} onChange={e => setCourseTypeId(e.target.value)}>
                <option value="">Select...</option>
                {state.courseTypes.map(ct => <option key={ct.id} value={ct.id}>{ct.name}</option>)}
              </select>
            </div>
            <div>
              <label>Course</label>
              <select value={courseId} onChange={e => setCourseId(e.target.value)}>
                <option value="">Select...</option>
                {state.courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <div className="actions">
            <button className="primary" type="submit">{editId ? 'Update' : 'Create'}</button>
            {editId && <button type="button" className="ghost" onClick={() => { setEditId(null); setCourseTypeId(''); setCourseId(''); setError(''); }}>Cancel</button>}
          </div>
        </form>
        <p className="muted">Example: "Individual - English", "Group - Hindi"</p>
      </div>
      <div className="card">
        <h3>Available Offerings</h3>
        {state.offerings.length === 0 ? <p className="muted">No offerings yet.</p> : (
          <div className="grid">
            {state.offerings.map(o => (
              <div key={o.id} className="actions" style={{justifyContent:'space-between'}}>
                <div className="chip">#{o.id} • {offeringLabel(o)}</div>
                <div className="actions">
                  <button onClick={() => onEdit(o)}>Edit</button>
                  <button className="danger" onClick={() => onDelete(o.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
