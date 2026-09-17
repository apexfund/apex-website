import { Component } from 'react'
import type { ReactNode } from 'react'

/**
 * Catches Convex server errors thrown by useQuery so the page doesn't
 * white-screen. On error the children are replaced with the fallback,
 * which defaults to null (render nothing for that section).
 */
export default class ConvexErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { error: boolean }
> {
  state = { error: false }
  static getDerivedStateFromError() { return { error: true } }
  render() {
    if (this.state.error) return this.props.fallback ?? null
    return this.props.children
  }
}
