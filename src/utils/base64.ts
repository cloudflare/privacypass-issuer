export const u8ToB64 = (u: Uint8Array): string => btoa(String.fromCharCode(...u));

export const b64Tou8 = (b: string): Uint8Array => Uint8Array.from(atob(b), c => c.charCodeAt(0));

export const b64ToB64URL = (s: string): string => s.replace(/\+/g, '-').replace(/\//g, '_');

export const b64URLtoB64 = (s: string): string => s.replace(/-/g, '+').replace(/_/g, '/');
