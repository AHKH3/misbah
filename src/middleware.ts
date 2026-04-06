import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
    // Always refresh session
    const response = await updateSession(request);

    // Protect admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const adminEmailsRaw = process.env.ADMIN_EMAILS;

        if (!supabaseUrl || !supabaseKey || !adminEmailsRaw) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        const adminEmails = adminEmailsRaw.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);

        const supabase = createServerClient(supabaseUrl, supabaseKey, {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll() {},
            },
        });

        const { data: { user } } = await supabase.auth.getUser();

        if (!user?.email || !adminEmails.includes(user.email.toLowerCase())) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
