export function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    return !!currentUser;
}

export function getCurrentUser() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
}