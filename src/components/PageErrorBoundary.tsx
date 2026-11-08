import { Component, type ReactNode } from 'react';

export default class PageErrorBoundary extends Component<
  {
    children: ReactNode;
    message: string;
    action: string;
  },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="alert" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-5">
          {this.props.message}
        </h1>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center min-h-11 rounded-lg bg-primary-700 px-5 py-2 text-white font-semibold"
        >
          {this.props.action}
        </button>
      </div>
    );
  }
}
