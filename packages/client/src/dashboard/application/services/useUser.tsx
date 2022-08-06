import { useState } from 'react';

import UserService from '../../domain/user/user.service';
import UserType from '../../domain/user/user.type';
import userRepository from '../../infrastructure/user.repository';
import userStore from '../../infrastructure/store/user.store';

const userService = new UserService(userRepository);

function useUser() {
  const [userInfo, setUserInfo] = useState(userStore.getUser());

  userStore.subscribeToUser((newUserData: UserType | null) => {
    setUserInfo(newUserData);
  });

  const getUser = () => {
    return userService.getUser();
  };

  const setUser = (user: UserType | null) => {
    return userService.setUser(user);
  };

  return { userInfo, getUser, setUser };
}

export default useUser;
