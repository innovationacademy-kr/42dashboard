import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum BocalRole {
  MASTER = 'master',
  ADMIN = 'admin', // read, write 제한 없이 가능
  VIEWER = 'viewer', // read 제한 없이 가능
  GUEST = 'guest', // 일부분 read만 가능
  // 더 추가할 ROLE이 있을지 생각해보기
}

@Entity()
export class Bocal {
  @PrimaryColumn({ name: 'id' })
  id: number;

  @Column({ name: 'login', nullable: false })
  login: string;

  @Column({ name: 'staff', nullable: false })
  staff: boolean; //의미 없는 컬럼일수도...?

  /**
   * api에서 오는 스태프 정보중에서 식별정보가 무엇무엇이 있는지 알아내서 column 추가하기
   */

  @Column({
    type: 'enum',
    enum: BocalRole,
    default: BocalRole.GUEST,
    nullable: false,
  }) //도메인 제한 확인(도메인 아닌거 넣으면 pg에서 에러발생하는거 확인)
  role: BocalRole;
}