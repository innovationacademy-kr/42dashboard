import UserRepositoryInterface from '../domain/user/user.repository.interface';
import UserType from '../domain/user/user.type';
import userStore from './store/user.store';

class UserRepository implements UserRepositoryInterface {
  public getUser(): UserType | null {
    return userStore.getUser();
  }

  public async setUser(user: UserType): Promise<void> {
    userStore.setUser(user);
  }
}

export default new UserRepository();
