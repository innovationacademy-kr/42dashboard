import { Query, Resolver } from '@nestjs/graphql';
import { SpreadService } from './spread.service';

@Resolver()
export class SpreadResolver {
  constructor(private readonly spreadService: SpreadService) {}

  @Query(() => String)
  async sendRequestToSpreadWithGoogleAPI(endpoint, id) {
    console.log(
      await this.spreadService.sendRequestToSpreadWithGoogleAPI(endpoint, id),
    );
    return 'finished';
  }
}
