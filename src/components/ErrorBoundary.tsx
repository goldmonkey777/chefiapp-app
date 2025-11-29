// Error Boundary para capturar erros de renderização

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center p-6 text-white">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Ops! Algo deu errado</h2>
            <p className="mb-6 text-red-100">
              {this.state.error?.message || 'Erro desconhecido'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="bg-white text-red-600 font-semibold px-6 py-3 rounded-xl hover:bg-red-50 transition"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

