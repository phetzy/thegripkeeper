import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';


// Example: re-export server-only functions here
export { revalidateTag, headers, NextRequest, NextResponse };
// Export any server-specific wrappers or helpers as needed, e.g.:
// export function getServerCart(...) { ... }
