import { useCallback, useState } from 'react'

type SetValue<T> = T | ((currentValue: T) => T)

function readStoredValue<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') {
    return initialValue
  }

  const storedValue = window.localStorage.getItem(key)
  if (storedValue === null) {
    return initialValue
  }

  try {
    return JSON.parse(storedValue) as T
  } catch {
    return initialValue
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: SetValue<T>) => void] {
  const [value, setValue] = useState<T>(() => readStoredValue(key, initialValue))

  const updateValue = useCallback(
    (nextValue: SetValue<T>) => {
      setValue((currentValue) => {
        const resolvedValue =
          typeof nextValue === 'function'
            ? (nextValue as (currentValue: T) => T)(currentValue)
            : nextValue

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(resolvedValue))
        }

        return resolvedValue
      })
    },
    [key],
  )

  return [value, updateValue]
}
