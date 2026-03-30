import { useForm, Head, Link } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApplySettings } from '@/Core/hooks/useApplySettings';
import InputField from '@/Core/Components/UI/InputField';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword?: boolean }) {
    const { t } = useTranslation();
    useApplySettings();

    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '', password: '', remember: false,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/login', { onFinish: () => reset('password') });
    };

    return (
        <>
            <Head title={t('auth.login')} />
            <div className="min-h-screen flex items-center justify-center p-4 bg-(--color-bg)">
                <div className="w-full max-w-md rounded-2xl border border-(--color-border) shadow-sm overflow-hidden bg-(--color-surface)">

                    {/* Header */}
                    <div className="px-8 pt-8 pb-6 border-b border-(--color-border) text-center">
                        <Link href="/" className="inline-flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl grid place-items-center text-white font-bold text-lg bg-(--color-primary)">
                                ✦
                            </div>
                            <span className="text-lg font-bold text-(--color-text-strong)">ERP System</span>
                        </Link>
                        <h1 className="text-xl font-bold text-(--color-text-strong)">{t('auth.login')}</h1>
                    </div>

                    {/* Form */}
                    <div className="px-8 py-6">
                        {status && (
                            <div className="mb-4 text-sm px-4 py-3 rounded-lg border border-(--color-success) text-(--color-success)"
                                style={{ background: 'rgba(16,185,129,0.1)' }}>
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            <InputField
                                label={t('auth.email')}
                                icon={Mail}
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="example@company.com"
                                error={errors.email}
                                autoFocus
                            />

                            <div className="relative">
                                <InputField
                                    label={t('auth.password')}
                                    icon={Lock}
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    error={errors.password}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-8 text-(--color-text-muted)"
                                    style={{ insetInlineEnd: '12px' }}>
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={data.remember}
                                        onChange={e => setData('remember', e.target.checked)}
                                        style={{ accentColor: 'var(--color-primary)' }} />
                                    <span className="text-sm text-(--color-text)">{t('auth.rememberMe')}</span>
                                </label>
                                {canResetPassword && (
                                    <Link href="/forgot-password" className="text-sm text-(--color-primary)">
                                        {t('auth.forgotPassword')}
                                    </Link>
                                )}
                            </div>

                            <button type="submit" disabled={processing}
                                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60 transition-opacity bg-(--color-primary)">
                                {processing ? t('common.loading') : t('auth.submit')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
