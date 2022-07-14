import UserRepositoryInterface from './user.repository.interface';
import UserType from './user.type';

class UserService {
  constructor(protected userRepository: UserRepositoryInterface) {}

  public async getUser(): Promise<UserType | null> {
    return this.userRepository.getUser();
  }
}

export default UserService;
