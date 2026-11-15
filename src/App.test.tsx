import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { StrictMode } from 'react'
import App from './App'
function renderAt(path: string) { window.history.pushState({}, '', path); return render(<App />) }
describe('SCM 공통 기반 라우팅', () => {
 it('기반 안내 홈을 렌더링한다', () => { renderAt('/'); expect(screen.getByRole('heading', { name: 'SCM 프론트엔드 기반' })).toBeInTheDocument() })
 it('로그인과 구매 하위 경로를 미구현 안내로 렌더링한다', () => { const view=renderAt('/login'); expect(within(screen.getByRole('main')).getByRole('heading', { name: '로그인', level: 1 })).toBeInTheDocument(); expect(screen.getByText('이 화면은 아직 구현되지 않았습니다.')).toBeInTheDocument(); view.unmount(); renderAt('/srm/orders'); expect(within(screen.getByRole('main')).getByRole('heading', { name: '구매 (SRM)', level: 1 })).toBeInTheDocument() })
 it('창고 하위 경로를 영역 안내로 렌더링한다', () => { renderAt('/wms/inventory'); expect(within(screen.getByRole('main')).getByRole('heading', { name: '창고 (WMS)', level: 1 })).toBeInTheDocument() })
 it('없는 주소는 404 안내로 보낸다', () => { renderAt('/unexpected'); expect(within(screen.getByRole('main')).getByRole('heading', { name: '페이지를 찾을 수 없습니다', level: 1 })).toBeInTheDocument() })
 it('모바일 메뉴 이동 후 Drawer가 닫히고 본문 경로가 전환된다', async () => { window.matchMedia = (query: string) => ({ matches: true, media: query, onchange: null, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false }); const user=userEvent.setup(); renderAt('/'); await user.click(screen.getByRole('button', { name: '메뉴 열기' })); const menu=within(screen.getByRole('navigation', { name: '주 메뉴' })); await user.click(menu.getByRole('link', { name: '구매 (SRM)' })); expect(window.location.pathname).toBe('/srm'); await waitFor(() => expect(within(screen.getByRole('main')).getByRole('heading', { name: '구매 (SRM)', level: 1 })).toBeInTheDocument()); await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument()); expect(screen.getByRole('button', { name: '메뉴 열기' })).toHaveAttribute('aria-expanded','false') })
})

describe('모바일 메뉴 키보드 포커스', () => {
 it('Enter로 열고 Escape로 닫은 뒤 전환이 끝나도 트리거에 포커스가 남는다', async () => {
  window.matchMedia = (query: string) => ({ matches: true, media: query, onchange: null, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false })
  const user = userEvent.setup()
  window.history.pushState({}, '', '/')
  render(<StrictMode><App /></StrictMode>)
  const trigger = screen.getByRole('button', { name: '메뉴 열기' })
  await user.tab()
  expect(trigger).toHaveFocus()
  await user.keyboard('{Enter}')
  await user.tab()
  expect(screen.getByRole('link', { name: '시작 안내' })).toHaveFocus()
  await user.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  // Wait beyond the real Drawer exit duration, including StrictMode effect cleanup.
  await new Promise(resolve => setTimeout(resolve, 350))
  expect(trigger).toHaveFocus()
  expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await user.tab()
  expect(screen.getByRole('link', { name: /MUI 공식/ })).toHaveFocus()
 })
})