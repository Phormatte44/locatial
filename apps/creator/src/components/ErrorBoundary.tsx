import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode; label?: string }
type State = { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', this.props.label ?? 'app', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2 bg-surface1 p-4 text-center">
          <div className="text-sm font-extrabold text-chalk">
            {this.props.label ?? 'Component'} failed to load
          </div>
          <p className="max-w-sm text-xs text-gray-mid">{this.state.error.message}</p>
          <button
            type="button"
            className="rounded-lg border border-gray-rule px-3 py-1.5 text-xs font-bold text-chalk"
            onClick={() => this.setState({ error: null })}
          >
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
