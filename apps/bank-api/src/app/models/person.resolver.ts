import { Query, Resolver } from '@nestjs/graphql';

@Resolver('Person')
export class PersonResolver {
  @Query()
  async getAllPerson() {
    return [
      {
        id: '1',
        name: '이규혁',
        number: '+82 10-1234-5678',
        email: 'lee@kyuhyuk.kr',
      },
      { id: '2', name: '변정원', number: '+82 10-8765-4321' },
    ];
  }
}