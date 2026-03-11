export function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 gap-3">
      <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </span>
      <span className="text-xs font-black text-slate-800 text-right">{value}</span>
    </div>
  )
}
