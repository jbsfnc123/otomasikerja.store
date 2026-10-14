/// <reference types="vite/client" />
// Path aset publik yang aman untuk deploy di subfolder (vite base './').
export const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`
