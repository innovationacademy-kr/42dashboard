import BoardDataRepositoryInterface from '../domain/boardData/boardData.repository.interface';
import BoardDataType from '../domain/boardData/boardData.type';
import boardDataStore from './store/boardData.store';

class BoardDataRepository implements BoardDataRepositoryInterface {
  public createBoard(): BoardDataType {
    const newBoard: BoardDataType = {
      sectionIds: [],
      sectionLayouts: [],
    };
    boardDataStore.setBoardData(newBoard);
    return newBoard;
  }

  public updateBoard(newBoardData: BoardDataType) {
    boardDataStore.setBoardData(newBoardData);
  }
}

export default new BoardDataRepository();
