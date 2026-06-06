import { Outlet } from 'react-router-dom';
import PanelLayout from '../../components/shared/PanelLayout';
import SidebarAdmin from './components/SidebarAdmin';

export default function AdminPanel() {
  return (
    <PanelLayout sidebar={<SidebarAdmin />}>
      <Outlet />
    </PanelLayout>
  );
}
