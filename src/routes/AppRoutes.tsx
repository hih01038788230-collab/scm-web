import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { DashboardPage, LoginPage, NotFoundPage, NotImplementedPage } from '../pages/Pages'
import { navigationLinks } from './navigation'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        {navigationLinks.filter(item => item.preparation).map(item => <Route key={item.id} path={item.path} element={<NotImplementedPage title={item.label} />} />)}
        <Route path="/srm/*" element={<NotImplementedPage title="구매 (SRM)" />} />
        <Route path="/wms/*" element={<NotImplementedPage title="창고 (WMS)" />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  )
}
