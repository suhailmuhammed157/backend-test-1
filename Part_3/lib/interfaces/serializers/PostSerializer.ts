import Post from "../../domain/entities/Post";
import { ServiceLocator } from "../../infrastructure/config/service-locator";
import Serializer from "./Serializer";

export default class UserSerializer extends Serializer {
  _serializeSingleEntity(entity: Post, serviceLocator: ServiceLocator): object {
    const userObj = {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      date_time: entity.dateTime,
      main_image: entity.mainImage,
      additional_images: entity.additionalImage
        ? entity.additionalImage
        : undefined,
    };
    return userObj;
  }
}
