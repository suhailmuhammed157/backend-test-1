import { ID } from "../../../domain/entities/Entity";
import { ServiceLocator } from "../../../infrastructure/config/service-locator";

export default (postId: ID, { postRepository }: ServiceLocator) =>
  postRepository!.remove(postId);
