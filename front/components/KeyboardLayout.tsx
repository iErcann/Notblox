'use client'
import React, { useState, useEffect } from 'react'
import { KeyboardLanguage } from '@/game/InputManager'

export default function KeyboardLayout() {
  const [keyboardLayout, setKeyboardLayout] = useState(KeyboardLanguage.EN)

  useEffect(() => {
    const savedLayout = localStorage.getItem('keyboardLayout')
    if (savedLayout) {
      setKeyboardLayout(savedLayout as KeyboardLanguage)
    }
  }, [])

  const toggleKeyboardLayout = () => {
    const newLayout =
      keyboardLayout === KeyboardLanguage.EN ? KeyboardLanguage.FR : KeyboardLanguage.EN
    setKeyboardLayout(newLayout)
    localStorage.setItem('keyboardLanguage', newLayout)
  }

  return (
    <div className="flex w-full md:w-fit flex-col border p-4 space-y-4 rounded-2xl items-center ">
      <p className="text-lg font-bold">
        Current controls {keyboardLayout === KeyboardLanguage.EN ? 'QWERTY' : 'AZERTY (French)'}
      </p>
      <p className="text-md font-semibold">Move</p>
      <div>
        <div>
          {keyboardLayout === KeyboardLanguage.EN ? (
            <>
              <kbd className="px-2 py-1.5 text-lg font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                W
              </kbd>
              <kbd className="px-2 py-1.5 text-lg font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                A
              </kbd>
              <kbd className="px-2 py-1.5 text-lg font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                S
              </kbd>
              <kbd className="px-2 py-1.5 text-lg font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                D
              </kbd>
            </>
          ) : (
            <>
              <kbd className="px-2 py-1.5 text-lg font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                Z
              </kbd>
              <kbd className="px-2 py-1.5 text-lg font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                Q
              </kbd>
              <kbd className="px-2 py-1.5 text-lg font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                S
              </kbd>
              <kbd className="px-2 py-1.5 text-lg font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                D
              </kbd>
            </>
          )}
        </div>
      </div>

      <button onClick={toggleKeyboardLayout}>
        Switch to {keyboardLayout === KeyboardLanguage.EN ? 'French' : 'US'} Keyboard
      </button>
    </div>
  )
}
