import Post from "../../../domain/entities/Post";
import MongoosePost from "../../orm/mongoose/schemas/Post";
import PostRepository from "../../../domain/repositories/PostRepository";
import PostSTO from "../../stos/mongoose/PostSTO";
import { ID } from "../../../domain/entities/Entity";

export default class PostRepositoryMongo implements PostRepository {
  async persist(domainEntity: Post): Promise<Post | null> {
    const { title, description, mainImage, dateTime, additionalImage } =
      domainEntity;
    const mongoosePost = new MongoosePost({
      title,
      description,
      date_time: dateTime,
      main_image: mainImage,
      additional_images: additionalImage,
    });
    await mongoosePost.save();
    return PostSTO(mongoosePost);
  }

  async merge(domainEntity: Post): Promise<Post | null> {
    const { id, title, description, mainImage, dateTime, additionalImage } =
      domainEntity;
    const mongoosePost = await MongoosePost.findByIdAndUpdate(
      id,
      {
        title,
        description,
        date_time: dateTime,
        main_image: mainImage,
        additional_images: additionalImage,
      },
      {
        new: true,
      }
    );
    return PostSTO(mongoosePost);
  }

  async remove(entityId: ID): Promise<boolean | null> {
    return MongoosePost.findOneAndDelete({ _id: entityId });
  }

  async get(entityId: ID): Promise<Post | null> {
    const mongooseUser = await MongoosePost.findById(entityId);
    if (!mongooseUser) return null;
    return PostSTO(mongooseUser);
  }

  async getByEmail(email: string): Promise<Post | null> {
    const mongooseUser = await MongoosePost.findOne({ email });
    if (!mongooseUser) return null;
    return PostSTO(mongooseUser);
  }

  async find(): Promise<Post[]> {
    const mongoosePosts = await MongoosePost.find().sort({ createdAt: -1 });
    return mongoosePosts
      .map((mongoosePost) => PostSTO(mongoosePost))
      .filter((post: Post | null): post is Post => post != null);
  }
}
