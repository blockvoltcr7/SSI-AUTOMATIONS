import { cookies } from 'next/headers';

export async function getAllCookies(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const out: Record<string, string> = {};
  cookieStore
    .getAll()
    .forEach(({ name, value }) => {
      out[name] = value;
    });
  return out;
}

export async function setAllCookies(obj: Record<string, string>) {
  const cookieStore = await cookies();
  Object.entries(obj).forEach(([name, value]) => {
    cookieStore.set({ name, value });
  });
}
