// import { Field, Int, ObjectType } from '@nestjs/graphql';
// import {
//   BaseEntity,
//   Column,
//   CreateDateColumn,
//   DeleteDateColumn,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// import { User } from '../../user_information/entity/user_information.entity';

// //지원금산정
// @ObjectType()
// @Entity()
// export class UserComputationFund extends BaseEntity {
//   @Field((type) => Int)
//   @PrimaryGeneratedColumn({ name: 'pk' })
//   pk: number;

//   @Field({ nullable: false })
//   @Column({ name: 'no_duplicate_collection', nullable: false, default: 'N' })
//   no_duplicate_collection: string;

//   @Field({ nullable: true })
//   @Column({ name: 'reason_of_no_duplicate', nullable: true })
//   reason_of_no_duplicate: string;

//   @Field({ nullable: false })
//   @Column({ name: 'is_received_fund', nullable: false, default: 'N' })
//   is_received_fund: string; //이름 오타 수정

//   @Field((type) => Int, { nullable: false })
//   @Column({ name: 'recevied_amount', nullable: false, default: 0 }) //이름수정
//   recevied_amount: number;

//   @Field({ nullable: true }) //지급일 추가예정
//   @Column({ name: 'payment_date', nullable: true })
//   payment_date: Date;

//   @Field({ nullable: false })
//   @CreateDateColumn({ name: 'created_date' })
//   created_date: Date;

//   @Field()
//   @DeleteDateColumn()
//   deleted_date: Date;

//   @Field()
//   @CreateDateColumn({
//     name: 'validate_date',
//     nullable: false,
//   })
//   validate_date: Date;

//   @Field()
//   @Column({
//     name: 'expired_date',
//     nullable: true,
//   })
//   expired_date: Date;

//   @Column({ name: 'fk_user_no', nullable: false })
//   fk_user_no: string;

//   @ManyToOne(() => User, (user) => user.userComputationFund, {
//     createForeignKeyConstraints: false, //외래키 제약조건 해제
//     nullable: false,
//   })
//   @JoinColumn({ name: 'fk_user_no' })
//   user: User;
// }
