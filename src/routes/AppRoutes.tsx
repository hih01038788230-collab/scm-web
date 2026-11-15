import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { HomePage, NotFoundPage, NotImplementedPage } from '../pages/Pages'
export function AppRoutes() { return <Routes><Route element={<AppLayout />}><Route path="/" element={<HomePage />} /><Route path="/login" element={<NotImplementedPage title="로그인" />} /><Route path="/srm" element={<NotImplementedPage title="구매 (SRM)" />} /><Route path="/srm/*" element={<NotImplementedPage title="구매 (SRM)" />} /><Route path="/wms" element={<NotImplementedPage title="창고 (WMS)" />} /><Route path="/wms/*" element={<NotImplementedPage title="창고 (WMS)" />} /><Route path="/404" element={<NotFoundPage />} /><Route path="*" element={<Navigate to="/404" replace />} /></Route></Routes> }
