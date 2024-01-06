interface BlogLayoutProps {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: BlogLayoutProps) {
  return <div className="container flex justify-center">{children}</div>;
}
