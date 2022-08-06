import UserRepositoryInterface from './user.repository.interface';
import UserType from './user.type';

class UserService {
  constructor(protected userRepository: UserRepositoryInterface) {}

  public async getUser(): Promise<UserType | null> {
    return this.userRepository.getUser();
  }

  public async setUser(user: UserType | null): Promise<void> {
    return this.userRepository.setUser(user);
  }
}

export default UserService;
