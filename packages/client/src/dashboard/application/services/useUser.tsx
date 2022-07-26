import { useState } from 'react';

import UserService from '../../domain/user/user.service';
import UserType from '../../domain/user/user.type';
import userRepository from '../../infrastructure/user.repository';
import userStore from '../../infrastructure/store/user.store';

const userService = new UserService(userRepository);

function useUser() {
  const [user, setUser] = useState(userStore.getUser());

  console.log('stateStickers', user);

  const getUser = () => {
    return userService.getUser();
  };

  return { user, getUser };
}

export default useUser;
