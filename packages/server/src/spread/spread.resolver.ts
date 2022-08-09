import { Query, Resolver } from '@nestjs/graphql';
import { SpreadService } from './spread.service';

@Resolver()
export class SpreadResolver {
  constructor(private readonly spreadService: SpreadService) {}
}
