import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('ErrorBoundary:', error, info);
    }

    handleReset = () => this.setState({ hasError: false, error: null });

    render() {
        if (!this.state.hasError) return this.props.children;
        if (this.props.fallback)  return this.props.fallback;

        return (
            <div className="min-h-screen grid place-items-center p-4" style={{ background: 'var(--color-bg)' }}>
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 rounded-2xl grid place-items-center mx-auto mb-6"
                        style={{ background: 'rgba(239,68,68,0.1)' }}>
                        <AlertTriangle size={36} style={{ color: 'var(--color-danger)' }} />
                    </div>
                    <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-strong)' }}>
                        حدث خطأ غير متوقع
                    </h1>
                    <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                        يرجى المحاولة مجدداً أو العودة للرئيسية.
                    </p>
                    {import.meta.env.DEV && this.state.error && (
                        <pre className="text-start text-xs rounded-lg p-3 mb-6 overflow-auto max-h-32 border"
                            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-danger)' }}>
                            {this.state.error.message}
                        </pre>
                    )}
                    <div className="flex items-center justify-center gap-3 mt-6">
                        <button onClick={this.handleReset}
                            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg text-white text-sm font-medium"
                            style={{ background: 'var(--color-primary)' }}>
                            <RotateCcw size={14} /> حاول مجدداً
                        </button>
                        <a href="/"
                            className="inline-flex items-center h-10 px-4 rounded-lg border text-sm font-medium no-underline"
                            style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-strong)' }}>
                            الرئيسية
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}
