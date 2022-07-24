import BoardDataType from './boardData.type';

interface BoardDataRepositoryInterface {
  createBoard: () => BoardDataType;
  updateBoard: (newBoardData: BoardDataType) => void;
}

export default BoardDataRepositoryInterface;
