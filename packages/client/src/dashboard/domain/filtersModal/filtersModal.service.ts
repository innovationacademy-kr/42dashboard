import FiltersModalRepositoryInterface from './filtersModal.repository.interface';
class FiltersModalService {
  constructor(
    protected filtersModalRepository: FiltersModalRepositoryInterface,
  ) {}

  public async openFilters() {
    console.log('open filters modal');
    return this.filtersModalRepository.openFilters();
  }

  public async applyFilters(): Promise<void> {
    return this.filtersModalRepository.applyFilters();
  }

  public async cancelFilters(): Promise<void> {
    console.log('cancel selected options');
    return this.filtersModalRepository.cancelFilters();
  }
}

export default FiltersModalService;
