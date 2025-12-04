// src/proxy.js
import { NextResponse } from "next/server";

export default function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;

  // Si pas de token → rediriger vers /login (sauf si déjà sur /login)
  if (!token) {
    if (pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // Si token présent ET sur /login → rediriger vers /
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Vérifier admin pour les routes /admin/*
  if (pathname.startsWith("/admin")) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // Laisser passer toutes les autres routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
