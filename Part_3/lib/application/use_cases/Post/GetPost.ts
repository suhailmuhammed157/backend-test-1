import { ID } from "../../../domain/entities/Entity";
import { ServiceLocator } from "../../../infrastructure/config/service-locator";

export default async (postId: ID, { postRepository }: ServiceLocator) => {
  const user = await postRepository!.get(postId);
  if (!user) {
    throw new Error("Invalid User");
  }
  return user;
};
