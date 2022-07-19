import BoardDataType from './boardData.type';

interface BoardDataRepositoryInterface {
  createBoard: () => BoardDataType;
}

export default BoardDataRepositoryInterface;
