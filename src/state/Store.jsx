import React, { createContext, useContext, useEffect, useReducer } from 'react'

const initial = {
  courseTypes: [], // {id, name}
  courses: [],     // {id, name}
  offerings: [],   // {id, courseTypeId, courseId}
  registrations: [], // {id, offeringId, studentName, email, phone}
  nextIds: { courseType: 1, course: 1, offering: 1, registration: 1 }
}

const KEY = 'srx:v1'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return initial
    const parsed = JSON.parse(raw)
    return { ...initial, ...parsed }
  } catch (e) {
    console.error('Failed to load store', e)
    return initial
  }
}

function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch (e) {
    console.error('Failed to save store', e)
  }
}

const StoreCtx = createContext(null)

function reducer(state, action) {
  switch (action.type) {
    // Course Types
    case 'ADD_COURSE_TYPE': {
      const id = state.nextIds.courseType
      return persist({
        ...state,
        courseTypes: [...state.courseTypes, { id, name: action.name }],
        nextIds: { ...state.nextIds, courseType: id + 1 }
      })
    }
    case 'UPDATE_COURSE_TYPE': {
      const courseTypes = state.courseTypes.map(ct => ct.id === action.id ? { ...ct, name: action.name } : ct)
      return persist({ ...state, courseTypes })
    }
    case 'DELETE_COURSE_TYPE': {
      const courseTypes = state.courseTypes.filter(ct => ct.id !== action.id)
      const offerings = state.offerings.filter(o => o.courseTypeId !== action.id)
      const registrations = state.registrations.filter(r => offerings.some(o => o.id === r.offeringId))
      // NOTE: because we filtered offerings, ensure registrations are also consistent.
      return persist({ ...state, courseTypes, offerings, registrations })
    }

    // Courses
    case 'ADD_COURSE': {
      const id = state.nextIds.course
      return persist({
        ...state,
        courses: [...state.courses, { id, name: action.name }],
        nextIds: { ...state.nextIds, course: id + 1 }
      })
    }
    case 'UPDATE_COURSE': {
      const courses = state.courses.map(c => c.id === action.id ? { ...c, name: action.name } : c)
      return persist({ ...state, courses })
    }
    case 'DELETE_COURSE': {
      const courses = state.courses.filter(c => c.id !== action.id)
      const offerings = state.offerings.filter(o => o.courseId !== action.id)
      const registrations = state.registrations.filter(r => offerings.some(o => o.id === r.offeringId))
      return persist({ ...state, courses, offerings, registrations })
    }

    // Offerings
    case 'ADD_OFFERING': {
      const id = state.nextIds.offering
      return persist({
        ...state,
        offerings: [...state.offerings, { id, courseTypeId: action.courseTypeId, courseId: action.courseId }],
        nextIds: { ...state.nextIds, offering: id + 1 }
      })
    }
    case 'UPDATE_OFFERING': {
      const offerings = state.offerings.map(o => o.id === action.id ? { ...o, courseTypeId: action.courseTypeId, courseId: action.courseId } : o)
      return persist({ ...state, offerings })
    }
    case 'DELETE_OFFERING': {
      const offerings = state.offerings.filter(o => o.id !== action.id)
      const registrations = state.registrations.filter(r => r.offeringId !== action.id)
      return persist({ ...state, offerings, registrations })
    }

    // Registrations
    case 'ADD_REGISTRATION': {
      const id = state.nextIds.registration
      return persist({
        ...state,
        registrations: [...state.registrations, {
          id,
          offeringId: action.offeringId,
          studentName: action.studentName,
          email: action.email,
          phone: action.phone || ''
        }],
        nextIds: { ...state.nextIds, registration: id + 1 }
      })
    }
    case 'DELETE_REGISTRATION': {
      const registrations = state.registrations.filter(r => r.id !== action.id)
      return persist({ ...state, registrations })
    }

    case 'RESET_ALL': {
      return persist({ ...initial })
    }

    default:
      return state
  }

  function persist(s) {
    save(s)
    return s
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => { save(state) }, [state])

  const helpers = {
    getCourseTypeName: (id) => state.courseTypes.find(x => x.id === id)?.name || '',
    getCourseName: (id) => state.courses.find(x => x.id === id)?.name || '',
    offeringLabel: (o) => `${state.courseTypes.find(x => x.id === o.courseTypeId)?.name || 'Type'} - ${state.courses.find(x => x.id === o.courseId)?.name || 'Course'}`,
    isDuplicateCourseType: (name, excludeId=null) => state.courseTypes.some(ct => ct.name.toLowerCase().trim() === name.toLowerCase().trim() && ct.id !== excludeId),
    isDuplicateCourse: (name, excludeId=null) => state.courses.some(c => c.name.toLowerCase().trim() === name.toLowerCase().trim() && c.id !== excludeId),
    isDuplicateOffering: (courseTypeId, courseId, excludeId=null) => state.offerings.some(o => o.courseTypeId === courseTypeId && o.courseId === courseId && o.id !== excludeId)
  }

  return (
    <StoreCtx.Provider value={{ state, dispatch, ...helpers }}>
      {children}
    </StoreCtx.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
