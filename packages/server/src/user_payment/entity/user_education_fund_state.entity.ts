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

// //지원금지급현황
// @ObjectType()
// @Entity()
// export class UserEducationFundState extends BaseEntity {
//   @Field((type) => Int)
//   @PrimaryGeneratedColumn({ name: 'pk' })
//   pk: number;

//   @Field((type) => Int, { nullable: false })
//   @Column({ name: 'total_payment_of_number', nullable: false, default: 0 })
//   total_payment_of_number: number;

//   @Field((type) => Int, { nullable: false })
//   @Column({ name: 'total_payment_of_money', nullable: false, default: 0 })
//   total_payment_of_money: number;

//   @Field({ nullable: false }) //data초기값이 설정안되어 있어서 추가
//   @Column({
//     name: 'fund_period',
//     nullable: false,
//     default: '9999-12-31',
//     type: 'date',
//   })
//   fund_period: Date;

//   @Field((type) => Int, { nullable: true })
//   @Column({ name: 'remaining_period_of_fund', nullable: true })
//   remaining_period_of_fund: number;

//   @Field((type) => Int, { nullable: false })
//   @Column({ name: 'total_calculated_month', nullable: false, default: 0 })
//   total_calculated_month: number;

//   @Field({ nullable: false }) //data초기값이 설정안되어 있어서 추가
//   @Column({
//     name: 'payment_give_start_date',
//     nullable: false,
//     default: '9999-12-31',
//     type: 'date',
//   })
//   payment_give_start_date: Date;

//   @Field((type) => Int, { nullable: true })
//   @Column({ name: 'payment_delay_period', nullable: true })
//   payment_delay_period: number;

//   @Field({ nullable: false }) //data초기값이 설정안되어 있어서 추가
//   @Column({
//     name: 'payment_end_date',
//     nullable: false,
//     default: '9999-12-31',
//     type: 'date',
//   })
//   payment_end_date: Date;

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

//   @ManyToOne(() => User, (user) => user.userEducationFundState, {
//     createForeignKeyConstraints: false, //외래키 제약조건 해제
//     nullable: false,
//   })
//   @JoinColumn({ name: 'fk_user_no' })
//   user: User;
// }
