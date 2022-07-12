// import { ObjectLiteral, Repository } from 'typeorm';

// export class MyRepository<T extends ObjectLiteral> extends Repository<T> {
//   public async customSave(proxy: EntityProxy<T>) {
//     const { ent, diff } = proxy;
//     if (!diff) {
//       return;
//     }

//     const id = this.getId(ent);
//     await this.update(id, diff);
//   }
// }
