import Post from "../../../domain/entities/Post";
import PostValidator from "../../../domain/validators/PostValidator";
import { ServiceLocator } from "../../../infrastructure/config/service-locator";

export default async (
  postData: any,
  { postRepository, passwordManager }: ServiceLocator
) => {
  await PostValidator.tailor("create").validateAsync(postData);
  const post = new Post({
    title: postData.title,
    description: postData.description,
    dateTime: postData.dateTime,
    mainImage: postData.mainImage,
    additionalImage: postData.additionalImage,
  });
  return postRepository!.persist(post);
};
