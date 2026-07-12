import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './styles/markdown.css'
import { ThemeProvider } from './ThemeContext'
import { ConvexProvider, ConvexReactClient } from 'convex/react'

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined

const root = (
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  convexUrl
    ? <ConvexProvider client={new ConvexReactClient(convexUrl)}>{root}</ConvexProvider>
    : root
)
