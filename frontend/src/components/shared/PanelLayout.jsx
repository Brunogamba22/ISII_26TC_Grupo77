export default function PanelLayout({ sidebar, children }) {
  return (
    <div className="h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-50 flex overflow-hidden">
      {sidebar}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
