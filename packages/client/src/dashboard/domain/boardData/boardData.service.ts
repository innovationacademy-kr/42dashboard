import BoardDataRepositoryInterface from './boardData.repository.interface';
import BoardDataType from './boardData.type';

class BoardDataService {
  constructor(protected boardDataRepository: BoardDataRepositoryInterface) {}

  public createNewBoardData(): BoardDataType {
    return this.boardDataRepository.createBoard();
  }
}

export default BoardDataService;
