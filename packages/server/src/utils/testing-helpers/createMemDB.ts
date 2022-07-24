import { User } from 'src/user_information/entity/user_information.entity';
import { createConnection, DataSource, EntitySchema } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/ban-types
type Entity = Function | string | EntitySchema<any>;

export async function createMemDB(entities: Entity[]) {
  return await new DataSource({
    type: 'postgres',
    database: 'forTest',
    entities: [__dirname + '/../../**/*.entity.{js,ts}'],
    dropSchema: true,
    synchronize: true,
    logging: false,
  });
}

// export async function createMemDB(entities: Entity[]) {
//   return await new DataSource({
//     // name, // let TypeORM manage the connections
//     type: 'postgres',
//     database: 'postgres',
//     host: 'localhost',
//     port: 5432,
//     username: 'huchoi',
//     password: 'huchoi',
//     entities: [__dirname + '/../../**/*.entity.{js,ts}'],
//     dropSchema: true,
//     synchronize: true,
//     logging: false,
//   });
// }
