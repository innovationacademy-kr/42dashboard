import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum BocalRole {
  MASTER = 'master',
  ADMIN = 'admin', // read, write 제한 없이 가능
  VIEWER = 'viewer', // read 제한 없이 가능
  GUEST = 'guest', // 일부분 read만 가능
  // 더 추가할 ROLE이 있을지 생각해보기
}

@Entity()
export class Bocal {
  @ApiProperty()
  // @PrimaryColumn({ name: 'id' })
  @PrimaryColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'login', nullable: false })
  intraName: string;

  @ApiProperty()
  @Column({ name: 'staff', nullable: false })
  isStaff: boolean; //의미 없는 컬럼일수도...?

  @ApiProperty()
  @Column({ name: 'email', nullable: false })
  email: string;

  @ApiProperty()
  @Column({ name: 'image_url', nullable: false })
  image_url: string;

  /**
   * api에서 오는 스태프 정보중에서 식별정보가 무엇무엇이 있는지 알아내서 column 추가하기
   */
  @ApiProperty()
  @Column({
    type: 'enum',
    enum: BocalRole,
    default: BocalRole.GUEST,
    nullable: false,
  }) //도메인 제한 확인(도메인 아닌거 넣으면 pg에서 에러발생하는거 확인)
  role: BocalRole;

  @Column({
    nullable: true,
  })
  currentHashedRefreshToken?: string;

  @OneToMany(() => PreSet, (preSetArray) => preSetArray.bocal)
  preSetArray: PreSet[];
}

@Entity()
@ObjectType()
export class PreSet extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'id' }) // preSetdata의 uuid로 이 값을 채울예정
  id: string;

  @Field()
  @Column({ name: 'preSetData', nullable: false })
  preSetData: string;

  @Field()
  @Column({ name: 'info', nullable: false })
  info: string;

  @ManyToOne(() => Bocal, (bocal) => bocal.preSetArray, { cascade: true })
  bocal: Bocal;
}

@Entity()
@ObjectType()
export class ErrorObject extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ name: 'id' }) // preSetdata의 uuid로 이 값을 채울예정
  id: number;

  @Field()
  @Column({ name: 'error', nullable: false })
  error: string;
}
