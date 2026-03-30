import { useForm, Head, Link } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApplySettings } from '@/Core/hooks/useApplySettings';
import InputField from '@/Core/Components/UI/InputField';

export default function Register() {
    const { t } = useTranslation();
    useApplySettings();

    const [showPassword, setShowPassword]   = useState(false);
    const [showConfirm,  setShowConfirm]    = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', password: '', password_confirmation: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/register', { onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <>
            <Head title={t('auth.login')} />
            <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-bg)' }}>
                <div className="w-full max-w-md rounded-2xl border shadow-sm overflow-hidden"
                    style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>

                    {/* Header */}
                    <div className="px-8 pt-8 pb-6 border-b text-center" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="inline-flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl grid place-items-center text-white font-bold text-lg"
                                style={{ background: 'var(--color-primary)' }}>✦</div>
                            <span className="text-lg font-bold" style={{ color: 'var(--color-text-strong)' }}>ERP System</span>
                        </div>
                        <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-strong)' }}>إنشاء حساب</h1>
                    </div>

                    {/* Form */}
                    <div className="px-8 py-6">
                        <form onSubmit={submit} className="space-y-4">
                            <InputField
                                label={t('crm.name')}
                                icon={User}
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                error={errors.name}
                                autoFocus
                            />
                            <InputField
                                label={t('auth.email')}
                                icon={Mail}
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="example@company.com"
                                error={errors.email}
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
                                    className="absolute top-8"
                                    style={{ insetInlineEnd: '12px', color: 'var(--color-text-muted)' }}>
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                            <div className="relative">
                                <InputField
                                    label="تأكيد كلمة المرور"
                                    icon={Lock}
                                    type={showConfirm ? 'text' : 'password'}
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    placeholder="••••••••"
                                    error={errors.password_confirmation}
                                />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute top-8"
                                    style={{ insetInlineEnd: '12px', color: 'var(--color-text-muted)' }}>
                                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>

                            <button type="submit" disabled={processing}
                                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60 transition-opacity mt-2"
                                style={{ background: 'var(--color-primary)' }}>
                                {processing ? t('common.loading') : 'إنشاء الحساب'}
                            </button>
                        </form>

                        <p className="text-center text-sm mt-6" style={{ color: 'var(--color-text-muted)' }}>
                            لديك حساب بالفعل؟{' '}
                            <Link href="/login" className="font-medium" style={{ color: 'var(--color-primary)' }}>
                                {t('auth.login')}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
