import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const ThemeContext = createContext({
    theme: 'light' as Theme,
    toggleTheme: () => {}
})

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>('light')

    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove(theme === 'light' ? 'dark' : 'light')
        root.classList.add(theme)
    }, [theme])

    const toggleTheme = () =>
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)
