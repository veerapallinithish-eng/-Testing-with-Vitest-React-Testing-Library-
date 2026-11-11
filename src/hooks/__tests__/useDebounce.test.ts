import { act, renderHook } from '@testing-library/react'
import { useDebounce } from '../useDebounce'

describe('useDebounce', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300))

    expect(result.current).toBe('hello')
  })

  it('does not update before the delay expires', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'hello' } },
    )

    rerender({ value: 'world' })
    act(() => vi.advanceTimersByTime(299))

    expect(result.current).toBe('hello')
  })

  it('updates when the debounce delay expires', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'hello' } },
    )

    rerender({ value: 'world' })
    act(() => vi.advanceTimersByTime(300))

    expect(result.current).toBe('world')
  })

  it('restarts the timer when the value changes again', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'first' } },
    )

    rerender({ value: 'second' })
    act(() => vi.advanceTimersByTime(200))
    rerender({ value: 'third' })
    act(() => vi.advanceTimersByTime(299))
    expect(result.current).toBe('first')
    act(() => vi.advanceTimersByTime(1))

    expect(result.current).toBe('third')
  })
})
