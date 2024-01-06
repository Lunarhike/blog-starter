interface BlogLayoutProps {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: BlogLayoutProps) {
  return (
    <div className="flex flex-1 flex-col mx-auto items-center">{children}</div>
  );
}
