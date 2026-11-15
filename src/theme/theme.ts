import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light', primary: { main: '#171717', dark: '#333333', contrastText: '#ffffff' },
    background: { default: '#F5F7FA', paper: '#FFFFFF' }, text: { primary: '#1F2937', secondary: '#4B5563' },
    divider: '#D1D5DB', success: { main: '#2E7D32' }, warning: { main: '#9A4D00' }, error: { main: '#C62828' },
  },
  typography: { fontFamily: '"맑은 고딕", "Malgun Gothic", "Apple SD Gothic Neo", sans-serif', fontSize: 14, body1: { fontSize: 14, lineHeight: 1.5 }, h1: { fontSize: 22, fontWeight: 600 }, h2: { fontSize: 16, fontWeight: 600 }, button: { fontSize: 14, fontWeight: 500, textTransform: 'none' }, caption: { fontSize: 12 }, subtitle2: { fontSize: 13, fontWeight: 600 } },
  spacing: 4,
  shape: { borderRadius: 4 },
  components: {
    MuiButtonBase: { styleOverrides: { root: { '&:focus-visible, &.Mui-focusVisible': { outline: '3px solid #9CA3AF', outlineOffset: 2 } } } },
    MuiCssBaseline: { styleOverrides: { body: { margin: 0, minWidth: 320 }, '*:focus-visible': { outline: '3px solid #6B7280', outlineOffset: 2 } } },
    MuiAppBar: { styleOverrides: { root: { backgroundColor: '#202020', color: '#F5F5F5', boxShadow: 'none', borderBottom: '1px solid #383838' } } },
    MuiDrawer: { styleOverrides: { paper: { backgroundColor: '#202020', color: '#F5F5F5', borderRight: '1px solid #383838' } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 4, minHeight: 36 }, contained: { '&:hover': { backgroundColor: '#333333' } }, outlined: { color: '#374151', borderColor: '#D1D5DB' } } },
    MuiPaper: { styleOverrides: { rounded: { borderRadius: 6 } } },
    MuiTableCell: { styleOverrides: { head: { backgroundColor: '#F3F4F6', color: '#374151', fontSize: 13, fontWeight: 600, height: 40 }, body: { color: '#1F2937', fontSize: 13, height: 36, borderColor: '#E5E7EB' } } },
  },
})

