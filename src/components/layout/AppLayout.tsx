import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div>
      <p>App Layout</p>
      <Outlet />
    </div>
  );
}