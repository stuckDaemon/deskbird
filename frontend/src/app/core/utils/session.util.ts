const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export function setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

export function setUser(user: any) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): any {
    const val = localStorage.getItem(USER_KEY);
    return val ? JSON.parse(val) : null;
}

export function clearUser() {
    localStorage.removeItem(USER_KEY);
}
