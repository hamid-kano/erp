export interface User {
    id: number;
    tenant_id: number;
    name: string;
    email: string;
    roles: string[];
    permissions: string[];
}

export interface PageProps {
    auth: { user: User };
    flash?: { success?: string; error?: string };
    currency: { code: string; symbol: string; decimal_places: number };
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}
