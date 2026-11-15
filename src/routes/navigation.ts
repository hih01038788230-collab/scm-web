export type NavigationItem = {
  id: string
  label: string
  icon?: 'home' | 'login' | 'purchase' | 'warehouse'
} & (
  | { kind: 'link'; path: string; preparation?: boolean }
  | { kind: 'group'; defaultExpanded?: boolean; children: NavigationItem[] }
)

// UI navigation only. Replace this source when a menu API contract is agreed.
export const navigation: NavigationItem[] = [
  { id: 'dashboard', kind: 'link', label: '대시보드', path: '/dashboard', icon: 'home' },
  { id: 'login', kind: 'link', label: '로그인', path: '/login', icon: 'login' },
  {
    id: 'srm', kind: 'group', label: '구매 (SRM)', icon: 'purchase',
    children: [{
      id: 'purchase-requests', kind: 'group', label: '전자구매요청', defaultExpanded: true,
      children: [
        { id: 'request-documents', kind: 'link', label: '구매요청문서현황', path: '/srm/purchase-requests/documents', preparation: true },
        { id: 'request-items', kind: 'link', label: '구매요청아이템현황', path: '/srm/purchase-requests/items', preparation: true },
      ],
    }],
  },
  { id: 'wms', kind: 'link', label: '창고 (WMS)', path: '/wms', icon: 'warehouse' },
]

export function getNavigationLinks(items: NavigationItem[]): Extract<NavigationItem, { kind: 'link' }>[] {
  return items.flatMap(item => item.kind === 'link' ? [item] : getNavigationLinks(item.children))
}

export const navigationLinks = getNavigationLinks(navigation)
