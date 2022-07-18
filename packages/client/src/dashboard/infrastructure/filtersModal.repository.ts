import FiltersModalRepositoryInterface from '../domain/filtersModal/filtersModal.repository.interface';
import filtersModalStore from './store/filtersModal.store';

class FiltersModalRepository implements FiltersModalRepositoryInterface {
  public async openFilters() {
    return filtersModalStore.setFiltersModal(true);
  }

  public async applyFilters() {
    return filtersModalStore.setFiltersModal(false);
  }

  public async cancelFilters() {
    return filtersModalStore.setFiltersModal(false);
  }
}

export default new FiltersModalRepository();
