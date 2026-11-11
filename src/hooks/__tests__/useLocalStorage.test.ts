import { act, renderHook } from '@testing-library/react'
import { useLocalStorage } from '../useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('returns the initial value when the key is not stored', () => {
    const { result } = renderHook(() => useLocalStorage('theme', 'light'))

    expect(result.current[0]).toBe('light')
  })

  it('returns the stored value when the key exists', () => {
    window.localStorage.setItem('theme', JSON.stringify('dark'))

    const { result } = renderHook(() => useLocalStorage('theme', 'light'))

    expect(result.current[0]).toBe('dark')
  })

  it('updates localStorage when the setter is called', () => {
    const { result } = renderHook(() => useLocalStorage('theme', 'light'))

    act(() => result.current[1]('dark'))

    expect(result.current[0]).toBe('dark')
    expect(window.localStorage.getItem('theme')).toBe('"dark"')
  })

  it('supports functional updates based on the current value', () => {
    const { result } = renderHook(() => useLocalStorage('count', 1))

    act(() => result.current[1]((current) => current + 1))

    expect(result.current[0]).toBe(2)
    expect(window.localStorage.getItem('count')).toBe('2')
  })
})
