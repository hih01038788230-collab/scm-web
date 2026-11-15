import { fireEvent, render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { StrictMode } from 'react'
import App from './App'

function renderAt(path: string) {
  window.history.pushState({}, '', path)
  return render(<StrictMode><App /></StrictMode>)
}
function setMobile(matches: boolean) {
  window.matchMedia = (query: string) => ({ matches, media: query, onchange: null, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false })
}
const main = () => within(screen.getByRole('main'))

beforeEach(() => setMobile(false))

describe('로그인과 메인 진입', () => {
  it('최초 경로를 replace하여 셸 없는 로그인으로 이동한다', async () => {
    window.history.replaceState({}, '', '/previous')
    window.history.pushState({}, '', '/')
    const length = window.history.length
    render(<App />)
    await waitFor(() => expect(window.location.pathname).toBe('/login'))
    expect(window.history.length).toBe(length)
    expect(main().getByRole('heading', { name: '로그인', level: 1 })).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
  })

  it('계정 입력과 로그인은 비활성이고 미리보기만 명시적으로 제공한다', async () => {
    const user = userEvent.setup()
    renderAt('/login')
    expect(screen.getByLabelText('아이디')).toBeDisabled()
    expect(screen.getByLabelText('비밀번호')).toBeDisabled()
    expect(screen.getByRole('button', { name: '로그인' })).toBeDisabled()
    expect(screen.getByText(/인증 API 연동 준비 중/)).toBeInTheDocument()
    expect(document.querySelector('form')).toBeNull()
    await user.tab()
    expect(screen.getByRole('link', { name: '대시보드 화면 미리보기' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(window.location.pathname).toBe('/dashboard')
    expect(main().getByRole('heading', { name: '대시보드', level: 1 })).toBeInTheDocument()
    expect(screen.getByText(/경로 접근 보호는 아직 구현되지/)).toBeInTheDocument()
    await user.click(within(screen.getByRole('navigation')).getByRole('link', { name: '로그인' }))
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    expect(window.location.pathname).toBe('/login')
  })

  it('대시보드 직접 진입과 재마운트에도 메인과 진입카드를 표시한다', () => {
    const view = renderAt('/dashboard')
    expect(main().getByRole('link', { name: '구매 영역으로 이동' })).toHaveAttribute('href', '/srm')
    expect(main().getByRole('link', { name: '창고 영역으로 이동' })).toHaveAttribute('href', '/wms')
    view.unmount()
    render(<App />)
    expect(main().getByRole('heading', { name: '대시보드', level: 1 })).toBeInTheDocument()
    expect(within(screen.getByRole('navigation')).getByRole('link', { name: '대시보드' })).toHaveAttribute('aria-current', 'page')
  })

  it('미리보기 후 브라우저 뒤로가기로 로그인에 돌아간다', async () => {
    const user = userEvent.setup()
    renderAt('/login')
    await user.click(screen.getByRole('link', { name: '대시보드 화면 미리보기' }))
    window.history.back()
    await waitFor(() => expect(main().getByRole('heading', { name: '로그인', level: 1 })).toBeInTheDocument())
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })
})

describe('업무 경로와 메뉴 회귀', () => {
  it('구매 메뉴를 Enter/Space로 펼치고 두 현황 링크로 이동한다', async () => {
    const user = userEvent.setup()
    renderAt('/dashboard')
    const srm = screen.getByRole('button', { name: '구매 (SRM)' })
    expect(srm).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('link', { name: '구매요청문서현황' })).not.toBeInTheDocument()
    await user.tab()
    await user.tab()
    await user.tab()
    expect(srm).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(srm).toHaveAttribute('aria-expanded', 'true')
    const requests = screen.getByRole('button', { name: '전자구매요청' })
    expect(requests).toHaveAttribute('aria-expanded', 'true')
    expect(document.getElementById(srm.getAttribute('aria-controls')!)).toContainElement(requests)
    await user.tab()
    expect(requests).toHaveFocus()
    await user.keyboard(' ')
    expect(requests).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('link', { name: '구매요청아이템현황' })).not.toBeInTheDocument()
    expect(window.location.pathname).toBe('/dashboard')
    await user.keyboard(' ')
    await user.tab()
    expect(screen.getByRole('link', { name: '구매요청문서현황' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(window.location.pathname).toBe('/srm/purchase-requests/documents')
    expect(main().getByRole('heading', { name: '구매요청문서현황', level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '구매요청문서현황' })).toHaveAttribute('aria-current', 'page')
    await user.click(screen.getByRole('link', { name: '구매요청아이템현황' }))
    expect(window.location.pathname).toBe('/srm/purchase-requests/items')
    expect(main().getByRole('heading', { name: '구매요청아이템현황', level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '구매요청아이템현황' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: '구매요청문서현황' })).not.toHaveAttribute('aria-current')
  })

  it.each([
    ['/srm/purchase-requests/documents', '구매요청문서현황'],
    ['/srm/purchase-requests/items', '구매요청아이템현황'],
  ])('%s 직접 진입 시 상위 펼침과 선택 및 현재 화면 제목을 유지한다', (path, title) => {
    renderAt(path)
    expect(screen.getByRole('button', { name: '구매 (SRM)' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: '전자구매요청' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('link', { name: title })).toHaveAttribute('aria-current', 'page')
    expect(main().getByRole('heading', { name: title, level: 1 })).toBeInTheDocument()
    expect(within(screen.getByRole('banner')).getByText(title)).toBeInTheDocument()
    expect(main().getByText('이 화면은 아직 구현되지 않았습니다.')).toBeInTheDocument()
  })

  it('메뉴 진입 전 초점이 없어도 닫힌 뒤 메뉴 버튼에서 Enter로 다시 연다', async () => {
    setMobile(true)
    const user = userEvent.setup()
    renderAt('/dashboard')
    const trigger = screen.getByRole('button', { name: '메뉴 열기' })
    expect(document.body).toHaveFocus()
    // Activate without prior focus: jsdom does not reproduce the browser's
    // missing relatedTarget when the Drawer opens.
    fireEvent.click(trigger)
    await user.tab()
    expect(screen.getByRole('link', { name: '대시보드' })).toHaveFocus()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(trigger).toHaveFocus())
    await user.keyboard('{Enter}')
    expect(screen.getByRole('dialog')).toBeVisible()
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it.each([['/srm', '구매 (SRM)'], ['/srm/orders', '구매 (SRM)'], ['/wms', '창고 (WMS)'], ['/wms/inventory', '창고 (WMS)']])('%s를 미구현 안내로 표시한다', (path, title) => {
    renderAt(path)
    expect(main().getByRole('heading', { name: title, level: 1 })).toBeInTheDocument()
    expect(screen.getByText('이 화면은 아직 구현되지 않았습니다.')).toBeInTheDocument()
  })

  it('없는 주소는 404로 이동하고 대시보드로 복귀한다', async () => {
    const user = userEvent.setup()
    renderAt('/unexpected')
    expect(window.location.pathname).toBe('/404')
    expect(main().getByRole('heading', { name: '페이지를 찾을 수 없습니다' })).toBeInTheDocument()
    await user.click(main().getByRole('link', { name: '대시보드로 이동' }))
    expect(window.location.pathname).toBe('/dashboard')
  })

  it('모바일에서 Enter 메뉴 이동과 Escape 후 포커스 복귀를 유지한다', async () => {
    setMobile(true)
    const user = userEvent.setup()
    renderAt('/dashboard')
    const trigger = screen.getByRole('button', { name: '메뉴 열기' })
    await user.tab()
    expect(trigger).toHaveFocus()
    for (let cycle = 0; cycle < 2; cycle += 1) {
      await user.keyboard('{Enter}')
      expect(screen.getByRole('dialog')).toBeVisible()
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
      await user.tab()
      expect(screen.getByRole('link', { name: '대시보드' })).toHaveFocus()
      await user.keyboard('{Escape}')
      await waitFor(() => expect(trigger).toHaveFocus())
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    }
  })

  it('모바일 상위 메뉴는 유지하고 말단 선택은 닫은 뒤 로그인으로 돌아간다', async () => {
    setMobile(true)
    const user = userEvent.setup()
    renderAt('/dashboard')
    await user.tab()
    await user.keyboard('{Enter}')
    const nav = within(screen.getByRole('navigation', { name: '주 메뉴' }))
    nav.getByRole('button', { name: '구매 (SRM)' }).focus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('dialog')).toBeVisible()
    const requests = nav.getByRole('button', { name: '전자구매요청' })
    expect(requests).toHaveAttribute('aria-expanded', 'true')
    await user.tab()
    expect(requests).toHaveFocus()
    await user.keyboard(' ')
    expect(requests).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('dialog')).toBeVisible()
    await user.keyboard(' ')
    await user.tab()
    expect(nav.getByRole('link', { name: '구매요청문서현황' })).toHaveFocus()
    await user.keyboard('{Enter}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(window.location.pathname).toBe('/srm/purchase-requests/documents')
    expect(main().getByRole('heading', { name: '구매요청문서현황', level: 1 })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '메뉴 열기' }))
    await user.click(screen.getByRole('link', { name: '로그인' }))
    expect(screen.queryByRole('button', { name: '메뉴 열기' })).not.toBeInTheDocument()
    expect(main().getByRole('heading', { name: '로그인', level: 1 })).toBeInTheDocument()
  })
})
