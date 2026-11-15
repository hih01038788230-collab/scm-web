import { Alert, Box, Button, Chip, Paper, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export function LoginPage() {
  return (
    <Box component="main" sx={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
      <Stack spacing={6} sx={{ bgcolor: '#202020', color: '#F5F5F5', p: { xs: 6, md: 12 }, justifyContent: 'center' }}>
        <Typography variant="overline" sx={{ letterSpacing: 3 }}>SCM WORKSPACE</Typography>
        <Box>
          <Typography component="p" sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 600, mb: 4 }}>구매부터 창고까지,<br />하나의 업무 공간</Typography>
          <Typography sx={{ color: '#D1D5DB', maxWidth: 420 }}>구매와 물류의 흐름을 연결하는 SCM 포털입니다. 필요한 업무를 한곳에서 시작하세요.</Typography>
        </Box>
        <Typography variant="caption" sx={{ color: '#D1D5DB' }}>구매 관리 · 창고 관리</Typography>
      </Stack>
      <Stack sx={{ p: { xs: 6, md: 12 }, alignItems: 'center', justifyContent: 'center' }}>
        <Paper variant="outlined" sx={{ width: '100%', maxWidth: 440, p: { xs: 5, sm: 8 }, boxSizing: 'border-box' }}>
          <Stack spacing={5}>
            <Box>
              <Typography variant="h1" gutterBottom>로그인</Typography>
              <Typography color="text.secondary">SCM 업무 공간에 오신 것을 환영합니다.</Typography>
            </Box>
            <Alert severity="info" id="login-status">인증 API 연동 준비 중입니다. 연동 전에는 계정 입력과 로그인을 사용할 수 없습니다.</Alert>
            <TextField label="아이디" disabled fullWidth size="small" autoComplete="off" />
            <TextField label="비밀번호" type="password" disabled fullWidth size="small" autoComplete="off" />
            <Button variant="contained" disabled fullWidth aria-describedby="login-status">로그인</Button>
            <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 5 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>로그인 없이 준비된 화면 구성을 살펴볼 수 있습니다. 미리보기는 인증 성공을 의미하지 않습니다.</Typography>
              <Button component={RouterLink} to="/dashboard" variant="outlined" fullWidth>대시보드 화면 미리보기</Button>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  )
}

export function DashboardPage() {
  return (
    <Stack spacing={6} sx={{ maxWidth: 1120 }}>
      <Box>
        <Typography variant="overline" color="text.secondary">SCM WORKSPACE</Typography>
        <Typography variant="h1" gutterBottom>대시보드</Typography>
        <Typography color="text.secondary">구매와 창고 업무를 시작하는 메인 화면입니다.</Typography>
      </Box>
      <Alert severity="info">화면 미리보기입니다. 인증과 경로 접근 보호는 아직 구현되지 않았으며, 실제 업무 데이터는 표시하지 않습니다.</Alert>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 6 }}>
        {[
          { title: '구매 (SRM)', description: '공급업체부터 구매요청과 발주까지, 구매 업무를 관리할 공간입니다.', path: '/srm', action: '구매 영역으로 이동' },
          { title: '창고 (WMS)', description: '입고부터 재고와 출고까지, 창고 업무를 관리할 공간입니다.', path: '/wms', action: '창고 영역으로 이동' },
        ].map(item => (
          <Paper key={item.path} variant="outlined" sx={{ p: 6, display: 'flex' }}>
            <Stack spacing={4} sx={{ flex: 1 }}>
              <Typography variant="h2">{item.title}</Typography>
              <Typography color="text.secondary" sx={{ flex: 1 }}>{item.description}</Typography>
              <Box><Chip size="small" label="업무 화면 준비 중" variant="outlined" /></Box>
              <Button component={RouterLink} to={item.path} variant="contained" sx={{ alignSelf: 'flex-start' }}>{item.action}</Button>
            </Stack>
          </Paper>
        ))}
      </Box>
      <Paper variant="outlined" sx={{ p: 6 }}>
        <Typography variant="h2" gutterBottom>연동 준비 상태</Typography>
        <Typography color="text.secondary">인증 및 구매·창고 API 계약을 확인한 뒤 실제 서비스를 연결합니다. 현재 로그인, 권한 확인과 업무 처리는 제공하지 않습니다.</Typography>
      </Paper>
    </Stack>
  )
}

export function NotImplementedPage({ title }: { title: string }) {
  return <Stack spacing={2} sx={{ maxWidth: 760 }}><Typography variant="h1">{title}</Typography><Alert severity="info">이 화면은 아직 구현되지 않았습니다.</Alert><Typography color="text.secondary">인증·업무 처리 및 API 연동은 확정된 요구사항과 계약을 받은 뒤 진행합니다.</Typography></Stack>
}

export function NotFoundPage() {
  return <Stack spacing={2} sx={{ maxWidth: 760 }}><Typography variant="h1">페이지를 찾을 수 없습니다</Typography><Alert severity="warning">요청한 경로에 해당하는 화면이 없습니다.</Alert><Button component={RouterLink} to="/dashboard" sx={{ alignSelf: 'flex-start' }}>대시보드로 이동</Button></Stack>
}
