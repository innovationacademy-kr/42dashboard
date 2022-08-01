import UserType from './user.type';

interface UserRepositoryInterface {
  getUser(): UserType | null;
  setUser(user: UserType): Promise<void>;
}

export default UserRepositoryInterface;
