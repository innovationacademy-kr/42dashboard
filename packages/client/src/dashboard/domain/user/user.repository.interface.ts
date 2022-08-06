import UserType from './user.type';

interface UserRepositoryInterface {
  getUser(): Promise<UserType | null>;
  setUser(user: UserType | null): Promise<void>;
}

export default UserRepositoryInterface;
