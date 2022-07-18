// ===================== ZUSTAND STORAGE =====================
import zustandStore from './zustand/dashboard.store.zustand';

class FiltersModalStore {
  public subscribeToFiltersModal(callback: (modal: boolean) => void) {
    zustandStore.subscribe(() => {
      callback(zustandStore.getState().filtersModal);
    });
  }

  public setFiltersModal(isOpen: boolean) {
    zustandStore.setState({
      filtersModal: isOpen,
    });
  }

  public getFiltersModal(): boolean {
    return zustandStore.getState().filtersModal;
  }
}

export default new FiltersModalStore();
