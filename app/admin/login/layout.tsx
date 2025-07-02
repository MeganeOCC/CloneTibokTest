export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout overrides the main admin layout
  // No navigation, just the login page
  return <>{children}</>;
}
