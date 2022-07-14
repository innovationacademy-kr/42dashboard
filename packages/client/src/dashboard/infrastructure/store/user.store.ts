// ===================== ZUSTAND STORAGE =====================

import UserType from '../../domain/user/user.type';
import zustandStore from './zustand/dashboard.store.zustand';

class UserStore {
  public subscribeToUser(callback: (user: UserType | null) => void) {
    zustandStore.subscribe(() => {
      callback(zustandStore.getState().user);
    });
  }

  public setUser(user: UserType | null) {
    zustandStore.setState({ user: user });
  }

  public getUser(): UserType | null {
    return zustandStore.getState().user;
  }
}

export default new UserStore();
