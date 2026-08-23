import { TodoViewMode } from '../../../_shared/types';

export function getViewerType({
  isUpcoming,
  isViewToggleVisible,
  viewMode,
}: {
  isUpcoming: boolean;
  isViewToggleVisible: boolean;
  viewMode: TodoViewMode;
}): 'upcoming' | 'list' | 'kanban' {
  if (isUpcoming) {
    return 'upcoming';
  }

  if (!isViewToggleVisible) {
    return 'list';
  }

  return viewMode === 'kanban' ? 'kanban' : 'list';
}
