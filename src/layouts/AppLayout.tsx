import { useState } from 'react'
import { AppBar, Box, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

const drawerWidth = 252
const navItems = [
  { label: '시작 안내', path: '/', icon: <HomeOutlinedIcon /> },
  { label: '로그인', path: '/login', icon: <LoginOutlinedIcon /> },
  { label: '구매 (SRM)', path: '/srm', icon: <ShoppingCartOutlinedIcon /> },
  { label: '창고 (WMS)', path: '/wms', icon: <WarehouseOutlinedIcon /> },
]
export function AppLayout() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const title = navItems.find(item => item.path === location.pathname)?.label ?? (location.pathname.startsWith('/srm') ? '구매 (SRM)' : location.pathname.startsWith('/wms') ? '창고 (WMS)' : 'SCM 포털')
  const nav = <Box component="nav" aria-label="주 메뉴"><Toolbar><Typography variant="h2" sx={{ color: '#fff' }}>SCM <Box component="span" sx={{ fontWeight: 400, color: '#c7c7c7' }}>WORKSPACE</Box></Typography></Toolbar><List>{navItems.map(item => <ListItemButton key={item.path} component={NavLink} to={item.path} end={item.path === '/'} onClick={() => setOpen(false)} sx={{ mx: 2, my: 0.5, borderRadius: 1, color: '#E5E5E5', '& .MuiListItemIcon-root': { color: 'inherit', minWidth: 40 }, '&.active': { bgcolor: '#383838', color: '#fff', borderLeft: '3px solid #fff' }, '&:hover': { bgcolor: '#303030' } }}><ListItemIcon>{item.icon}</ListItemIcon><ListItemText primary={item.label} /></ListItemButton>)}</List></Box>
  return <Box sx={{ display: 'flex', minHeight: '100vh' }}><AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}><Toolbar>{isMobile && <IconButton color="inherit" edge="start" aria-label="메뉴 열기" aria-expanded={open} onClick={() => setOpen(true)} sx={{ mr: 2 }}><MenuIcon /></IconButton>}<Typography variant="h2" component="div">{title}</Typography></Toolbar></AppBar>{isMobile ? <Drawer variant="temporary" open={open} onClose={() => setOpen(false)} ModalProps={{ keepMounted: true }} slotProps={{ paper: { sx: { width: drawerWidth } } }}><Toolbar /><Box onKeyDown={event => { if (event.key === 'Escape') setOpen(false) }}>{nav}</Box></Drawer> : <Drawer variant="permanent" open slotProps={{ paper: { sx: { width: drawerWidth, boxSizing: 'border-box' } } }}><Toolbar />{nav}</Drawer>}<Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: { xs: 2, sm: 3, md: 4 }, ml: { md: `${drawerWidth}px` } }}><Toolbar /><Outlet /></Box></Box>
}



