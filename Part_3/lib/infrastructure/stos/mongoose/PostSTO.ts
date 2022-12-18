import Post from "../../../domain/entities/Post";

export default (schemaEntity: any): Post | null => {
  if (!schemaEntity) return null;
  return new Post({
    id: schemaEntity.id,
    title: schemaEntity.title,
    description: schemaEntity.description,
    dateTime: schemaEntity.date_time,
    mainImage: schemaEntity.main_image,
    additionalImage: schemaEntity.additional_images,
  });
};
