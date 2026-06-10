import { NavLink } from 'react-router-dom';
import { Shield, LogOut } from 'lucide-react';
import { adminMenuItems } from '../config/adminMenu';

export default function SidebarAdmin() {
  return (
    <aside className="w-64 bg-gradient-to-b from-cyan-100 to-cyan-50 h-screen sticky top-0 p-4 flex flex-col">
      <div className="flex items-center gap-3 px-4 py-4 mb-6">
        <div className="text-cyan-600">
          <Shield size={32} />
        </div>
        <span className="text-xl font-bold text-cyan-800">MediGuard Pro</span>
      </div>

      <nav className="flex-1 space-y-2">
        {adminMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={`/admin/${item.path}`}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-white shadow-md text-cyan-700 font-medium'
                    : 'text-gray-600 hover:bg-white/50 hover:text-cyan-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} className={isActive ? 'text-cyan-600' : 'text-gray-500'} />
                  <span className="text-sm">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto pt-4">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left text-red-600 hover:bg-red-50 hover:text-red-700 font-medium bg-transparent shadow-none border-none"
          style={{ margin: 0 }}
        >
          <LogOut size={20} />
          <span className="text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
