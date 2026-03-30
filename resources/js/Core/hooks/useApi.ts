import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '@/Core/services/api';

interface AsyncState<T> {
    data:    T | null;
    loading: boolean;
    error:   string | null;
}

function extractError(e: any, t: (k: string) => string): string {
    if (!e.response)               return t('errors.network');
    if (e.response.status === 401) return t('errors.unauthorized');
    if (e.response.status >= 500)  return t('errors.server');
    return e.response?.data?.message ?? e.message ?? t('errors.unknown');
}

// ── Generic fetch hook ────────────────────────────────
export function useFetch<T>(url: string, params?: Record<string, any>) {
    const { t } = useTranslation();
    const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null });

    const fetch = () => {
        setState(s => ({ ...s, loading: true }));
        api.get<T>(url, { params })
            .then(r  => setState({ data: r.data, loading: false, error: null }))
            .catch(e => setState({ data: null,   loading: false, error: extractError(e, t) }));
    };

    useEffect(() => { fetch(); }, [url, JSON.stringify(params)]);

    return { ...state, refetch: fetch };
}

// ── Generic mutation hook ─────────────────────────────
export function useMutation<TData = any, TPayload = any>(
    method: 'post' | 'put' | 'patch' | 'delete',
    url: string,
    onSuccess?: (data: TData) => void,
) {
    const { t } = useTranslation();
    const [state, setState] = useState<AsyncState<TData>>({ data: null, loading: false, error: null });

    const mutate = async (payload?: TPayload) => {
        setState({ data: null, loading: true, error: null });
        try {
            const r = await api[method]<TData>(url, payload);
            setState({ data: r.data, loading: false, error: null });
            onSuccess?.(r.data);
            return r.data;
        } catch (e: any) {
            const error = extractError(e, t);
            setState({ data: null, loading: false, error });
            throw e;
        }
    };

    return { ...state, mutate };
}
