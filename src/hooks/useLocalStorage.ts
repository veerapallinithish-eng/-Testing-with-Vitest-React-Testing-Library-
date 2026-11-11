import { useCallback, useState } from 'react'

type SetValue<T> = T | ((currentValue: T) => T)

function readStoredValue<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') {
    return initialValue
  }

  const storedValue = window.localStorage.getItem(key)
  return storedValue === null ? initialValue : (JSON.parse(storedValue) as T)
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: SetValue<T>) => void] {
  const [value, setValue] = useState(() => readStoredValue(key, initialValue))

  const updateValue = useCallback(
    (nextValue: SetValue<T>) => {
      const resolvedValue =
        typeof nextValue === 'function'
          ? (nextValue as (currentValue: T) => T)(value)
          : nextValue
      window.localStorage.setItem(key, JSON.stringify(resolvedValue))
      setValue(resolvedValue)
    },
    [key, value],
  )

  return [value, updateValue]
}
