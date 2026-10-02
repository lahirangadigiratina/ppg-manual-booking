import type { LucideIcon } from 'lucide-react'
import {
  Archive,
  ClipboardList,
  FileText,
  LayoutGrid,
  Package,
  PackageCheck,
  Presentation,
  Undo2,
} from 'lucide-react'

export type NavItemId =
  | 'collection'
  | 'returns'
  | 'manual-checkin'
  | 'reports'
  | 'aged-parcels'
  | 'training'
  | 'supply-request'
  | 'ppg'

export interface NavItem {
  id: NavItemId
  label: string
  icon: LucideIcon
  badge?: number
}

export const navItems: NavItem[] = [
  { id: 'collection', label: 'Collection', icon: Package },
  { id: 'returns', label: 'Returns', icon: Undo2 },
  { id: 'manual-checkin', label: 'Manual Checkin', icon: PackageCheck },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'aged-parcels', label: 'Aged Parcels', icon: Archive, badge: 0 },
  { id: 'training', label: 'Training', icon: Presentation },
  { id: 'supply-request', label: 'Supply Request', icon: ClipboardList },
  { id: 'ppg', label: 'PPG', icon: LayoutGrid },
]
