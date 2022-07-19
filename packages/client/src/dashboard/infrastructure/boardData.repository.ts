import BoardDataRepositoryInterface from '../domain/boardData/boardData.repository.interface';
import BoardDataType from '../domain/boardData/boardData.type';
import boardDataStore from './store/boardData.store';
import { v4 as uuid } from 'uuid';

class BoardDataRepository implements BoardDataRepositoryInterface {
  public createBoard(): BoardDataType {
    const newBoard: BoardDataType = {
      id: uuid(),
      sectionIds: [],
      sectionLayouts: [],
    };
    boardDataStore.setBoardData(newBoard);
    return newBoard;
  }
}

export default new BoardDataRepository();
