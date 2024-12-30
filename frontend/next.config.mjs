/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export default nextConfig;
