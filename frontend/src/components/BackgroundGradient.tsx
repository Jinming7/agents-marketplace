export function BackgroundGradient() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-slate-50">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-white to-slate-50" />
      <div className="absolute left-[-10%] top-[-10%] h-[50%] w-[50%] rounded-full bg-blue-100/40 blur-[120px] filter mix-blend-multiply" />
      <div className="absolute right-[-10%] top-[-10%] h-[50%] w-[50%] rounded-full bg-indigo-50/40 blur-[120px] filter mix-blend-multiply" />
    </div>
  );
}
