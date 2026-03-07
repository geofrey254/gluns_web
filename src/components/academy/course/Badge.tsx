export function Badge({
  icon: Icon,
  children,
}: {
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-2xl bg-blue-50 border border-blue-100 text-[#104179] px-3 py-1.5 text-xs font-black uppercase tracking-widest">
      <Icon className="w-3.5 h-3.5" />
      {children}
    </span>
  )
}
