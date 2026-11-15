import { useRef, useState } from 'react'
import { AppBar, Box, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { getNavigationLinks, navigation, navigationLinks, type NavigationItem } from '../routes/navigation'

const drawerWidth = 252
const icons = { home: <HomeOutlinedIcon />, login: <LoginOutlinedIcon />, purchase: <ShoppingCartOutlinedIcon />, warehouse: <WarehouseOutlinedIcon /> }
export function AppLayout() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [open, setOpen] = useState(false)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)
  const location = useLocation()
  // A new route restores its ancestor defaults; users may still collapse the current route.
  const [expansion, setExpansion] = useState<{ pathname: string; values: Record<string, boolean> }>({ pathname: location.pathname, values: {} })
  const pathname = location.pathname.replace(/\/+$/, '')
  const title = navigationLinks.find(item => item.path === pathname)?.label ?? (pathname.startsWith('/srm') ? '구매 (SRM)' : pathname.startsWith('/wms') ? '창고 (WMS)' : 'SCM 포털')
  function renderItems(items: NavigationItem[], depth = 0) {
    return items.map(item => {
      const activeBranch = item.kind === 'group' && (getNavigationLinks(item.children).some(link => link.path === pathname) || (item.id === 'srm' && pathname.startsWith('/srm')))
      const expanded = item.kind === 'group' && ((expansion.pathname === location.pathname ? expansion.values[item.id] : undefined) ?? (activeBranch || item.defaultExpanded || false))
      const sx = { mx: 2, my: 0.5, pl: 2 + depth * 2, borderRadius: 1, color: '#E5E5E5', '& .MuiListItemIcon-root': { color: 'inherit', minWidth: 40 }, '&.active': { bgcolor: '#383838', color: '#fff', borderLeft: '3px solid #fff' }, '&:hover': { bgcolor: '#303030' }, '&:focus': { outline: '2px solid #fff', outlineOffset: '-2px' } }
      const content = <>{item.icon && <ListItemIcon>{icons[item.icon]}</ListItemIcon>}<ListItemText primary={item.label} />{item.kind === 'group' && (expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />)}</>
      return <Box component="li" key={item.id}>
        {item.kind === 'link' ? <ListItemButton component={NavLink} to={item.path} end={item.path !== '/wms'} onClick={() => setOpen(false)} sx={sx}>{content}</ListItemButton> : <>
          <ListItemButton component="button" type="button" aria-expanded={expanded} aria-controls={`nav-${item.id}-children`} onClick={() => setExpansion(previous => ({ pathname: location.pathname, values: { ...(previous.pathname === location.pathname ? previous.values : {}), [item.id]: !expanded } }))} sx={{ ...sx, width: 'calc(100% - 16px)', textAlign: 'left' }}>{content}</ListItemButton>
          <List id={`nav-${item.id}-children`} aria-label={`${item.label} 하위 메뉴`} disablePadding hidden={!expanded}>{renderItems(item.children, depth + 1)}</List>
        </>}
      </Box>
    })
  }
  const nav = <Box component="nav" aria-label="주 메뉴"><Toolbar><Typography variant="h2" sx={{ color: '#fff' }}>SCM <Box component="span" sx={{ fontWeight: 400, color: '#c7c7c7' }}>WORKSPACE</Box></Typography></Toolbar><List>{renderItems(navigation)}</List></Box>
  return <Box sx={{ display: 'flex', minHeight: '100vh' }}><AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}><Toolbar>{isMobile && <IconButton ref={menuTriggerRef} color="inherit" aria-label="메뉴 열기" aria-expanded={open} onClick={() => setOpen(true)} sx={{ mr: 2, '&:focus': { outline: '3px solid #fff', outlineOffset: '2px' } }}><MenuIcon /></IconButton>}<Typography variant="h2" component="div">{title}</Typography></Toolbar></AppBar>{isMobile ? <Drawer variant="temporary" open={open} onClose={() => setOpen(false)} ModalProps={{ keepMounted: true, disableRestoreFocus: true }} slotProps={{
    paper: { sx: { width: drawerWidth } },
    // Restore after the closing transition so hidden Drawer content cannot retain focus.
    transition: { onExited: () => menuTriggerRef.current?.focus() },
  }}><Toolbar />{nav}</Drawer> : <Drawer variant="permanent" open slotProps={{ paper: { sx: { width: drawerWidth, boxSizing: 'border-box' } } }}><Toolbar />{nav}</Drawer>}<Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: { xs: 2, sm: 3, md: 4 }, ml: { md: `${drawerWidth}px` } }}><Toolbar /><Outlet /></Box></Box>
}



