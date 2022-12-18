import { ID } from "../entities/Entity";
import Post from "../entities/Post";

export default interface PostRepository {
  persist(domainEntity: Post): Promise<Post | null>;

  merge(domainEntity: Post): Promise<Post | null>;

  remove(entityId: ID): Promise<boolean | null>;

  get(entityId: ID): Promise<Post | null>;

  find(): Promise<Post[]>;
}
