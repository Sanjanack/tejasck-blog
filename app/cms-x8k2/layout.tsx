import CMSShell from './CMSShell'

export default function CMSLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <CMSShell>{children}</CMSShell>
}
