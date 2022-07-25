import { useState } from 'react';
import FiltersModalService from '../../domain/filtersModal/filtersModal.service';
import filtersModalRepository from '../../infrastructure/filtersModal.repository';
import filtersModalStore from '../../infrastructure/store/filtersModal.store';

const filtersModalService = new FiltersModalService(filtersModalRepository);

function useFiltersModal() {
  const [isOpen, setIsOpen] = useState(filtersModalStore.getFiltersModal());

  filtersModalStore.subscribeToFiltersModal((isOpen: boolean) => {
    setIsOpen(isOpen);
  });

  const openFiltersModal = async () => {
    return filtersModalService.openFilters();
  };

  const applyFiltersModal = async () => {
    return await filtersModalService.applyFilters();
  };

  const cancelFiltersModal = async () => {
    return await filtersModalService.cancelFilters();
  };

  return { isOpen, openFiltersModal, applyFiltersModal, cancelFiltersModal };
}

export default useFiltersModal;
