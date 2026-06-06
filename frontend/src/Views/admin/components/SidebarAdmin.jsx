import { NavLink } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { adminMenuItems } from '../config/adminMenu';

export default function SidebarAdmin() {
  return (
    <aside className="w-64 bg-gradient-to-b from-cyan-100 to-cyan-50 min-h-screen p-4 flex flex-col">
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
    </aside>
  );
}
