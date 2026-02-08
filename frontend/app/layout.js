import "./globals.css";

export const metadata = {
  title: "FastAPI + Next.js CRUD",
  description: "Simple CRUD app"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
