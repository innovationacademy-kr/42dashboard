import UserRepositoryInterface from './user.repository.interface';
import UserType from './user.type';

class UserService {
  constructor(protected userRepository: UserRepositoryInterface) {}

  public getUser(): UserType | null {
    return this.userRepository.getUser();
  }

  public setUser(user: UserType): Promise<void> {
    return this.userRepository.setUser(user);
  }
}

export default UserService;
