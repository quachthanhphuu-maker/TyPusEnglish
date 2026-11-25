import type { ParentChildDashboardDTO } from '@/types';

export function selectParentChild(
  children: readonly ParentChildDashboardDTO[],
  selectedId: string,
): ParentChildDashboardDTO | null {
  return children.find((child) => child.id === selectedId) ?? children[0] ?? null;
}
