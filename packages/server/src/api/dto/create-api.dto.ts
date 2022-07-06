//import { IsNotEmpty } from 'class-validator';

export class CreateApiDto {
  //  @IsNotEmpty()
  level: number;

  // @IsNotEmpty()
  email: string;

  //  @IsNotEmpty()
  phone: string;

  // @IsNotEmpty()
  circle: number;

  //  @IsNotEmpty()
  outercircle: string;

  //  @IsNotEmpty()
  outercircle_date: Date;

  //  @IsNotEmpty()
  coaltion_score: number;

  //  @IsNotEmpty()
  blackhole_time: Date;

  //  @IsNotEmpty()
  remaining_period: number;
}
