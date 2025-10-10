import { cookies } from 'next/headers'

export function getAllCookies(): Record<string, string> {
  const out: Record<string, string> = {};
  cookies().getAll().forEach(({ name, value }) => {
    out[name] = value;
  });
  return out;
}

export function setAllCookies(obj: Record<string, string>) {
  Object.entries(obj).forEach(([name, value]) => {
    cookies().set({ name, value });
  });
}
