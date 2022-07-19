import BoardDataType from '../../domain/boardData/boardData.type';
import zustandStore from './zustand/dashboard.store.zustand';

// ===================== ZUSTAND STORAGE =====================
class BoardDataStore {
  public subscribeToBoardData(
    callback: (boardDatas: BoardDataType | null) => void,
  ) {
    zustandStore.subscribe(() => {
      callback(zustandStore.getState().boardData);
    });
  }

  public setBoardData(boardData: BoardDataType) {
    zustandStore.setState({ boardData });
  }

  public getBoardData(): BoardDataType | null {
    return zustandStore.getState().boardData;
  }
}

export default new BoardDataStore();
