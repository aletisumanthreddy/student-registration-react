import React, { useMemo, useState } from 'react'
import { useStore } from '../state/Store'

const emailOk = (v) => /.+@.+\..+/.test(v)
const phoneOk = (v) => v === '' || /^[0-9\-\+\s]{7,15}$/.test(v)

export default function Registrations() {
  const { state, dispatch, offeringLabel } = useStore()
  const [filterCourseTypeId, setFilterCourseTypeId] = useState('')
  const [selectedOfferingId, setSelectedOfferingId] = useState('')
  const [studentName, setStudentName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const offeringsFiltered = useMemo(() => {
    const all = state.offerings
    const ctId = Number(filterCourseTypeId) || null
    return ctId ? all.filter(o => o.courseTypeId === ctId) : all
  }, [state.offerings, filterCourseTypeId])

  const registrationsForSelected = useMemo(() => {
    const oId = Number(selectedOfferingId) || null
    return oId ? state.registrations.filter(r => r.offeringId === oId) : []
  }, [state.registrations, selectedOfferingId])

  const onRegister = (e) => {
    e.preventDefault()
    if (!selectedOfferingId) return setError('Please choose an offering')
    if (!studentName.trim()) return setError('Student name is required')
    if (!emailOk(email)) return setError('Enter a valid email')
    if (!phoneOk(phone)) return setError('Enter a valid phone number or leave blank')
    dispatch({
      type: 'ADD_REGISTRATION',
      offeringId: Number(selectedOfferingId),
      studentName: studentName.trim(),
      email: email.trim(),
      phone: phone.trim()
    })
    setStudentName(''); setEmail(''); setPhone('')
    setError(''); setSuccess('Student registered.')
    setTimeout(() => setSuccess(''), 1500)
  }

  const onDelete = (id) => {
    if (confirm('Remove this registration?')) {
      dispatch({ type: 'DELETE_REGISTRATION', id })
    }
  }

  return (
    <div className="grid">
      <div className="card">
        <h3>Register Student</h3>
        <form className="grid" onSubmit={onRegister}>
          <div className="row">
            <div>
              <label>Filter Offerings by Course Type</label>
              <select value={filterCourseTypeId} onChange={e => { setFilterCourseTypeId(e.target.value); setSelectedOfferingId(''); }}>
                <option value="">All Types</option>
                {state.courseTypes.map(ct => <option key={ct.id} value={ct.id}>{ct.name}</option>)}
              </select>
            </div>
            <div>
              <label>Offering</label>
              <select value={selectedOfferingId} onChange={e => setSelectedOfferingId(e.target.value)}>
                <option value="">Select...</option>
                {offeringsFiltered.map(o => <option key={o.id} value={o.id}>{offeringLabel(o)}</option>)}
              </select>
            </div>
          </div>
          <div className="row">
            <div>
              <label>Student Name</label>
              <input value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="Full name" />
            </div>
            <div>
              <label>Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" />
            </div>
          </div>
          <div className="row">
            <div>
              <label>Phone (optional)</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" />
            </div>
          </div>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <div className="actions">
            <button type="submit" className="primary">Register</button>
            <button type="button" className="ghost" onClick={() => { setStudentName(''); setEmail(''); setPhone(''); setError(''); setSuccess(''); }}>Clear</button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Registered Students {selectedOfferingId ? `for ${offeringLabel(state.offerings.find(o => o.id === Number(selectedOfferingId))||{})}` : ''}</h3>
        {selectedOfferingId ? (
          registrationsForSelected.length === 0 ? <p className="muted">No students registered yet.</p> : (
            <div className="grid">
              {registrationsForSelected.map(r => (
                <div key={r.id} className="actions" style={{justifyContent:'space-between'}}>
                  <div>
                    <div className="chip">#{r.id} • {r.studentName}</div>
                    <div className="muted">{r.email}{r.phone ? ` • ${r.phone}` : ''}</div>
                  </div>
                  <button className="danger" onClick={() => onDelete(r.id)}>Remove</button>
                </div>
              ))}
            </div>
          )
        ) : <p className="muted">Select an offering above to see its registrations.</p>}
      </div>
    </div>
  )
}
