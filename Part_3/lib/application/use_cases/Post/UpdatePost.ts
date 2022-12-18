import PostValidator from "../../../domain/validators/PostValidator";
import GetPost from "./GetPost";
import { ServiceLocator } from "../../../infrastructure/config/service-locator";

export default async (postData: any, serviceLocator: ServiceLocator) => {
  const { postRepository } = serviceLocator;
  let post = await GetPost(postData.id, serviceLocator);
  if (post == null) throw new Error("Unknown ID");
  post = { ...post, ...postData };
  await PostValidator.tailor("update").validateAsync(post);
  return postRepository!.merge(post);
};
