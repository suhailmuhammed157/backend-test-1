import Entity, { ID } from "./Entity";

export default class Post extends Entity {
  title: string;
  description: string;
  dateTime: string;
  mainImage: string;
  additionalImage?: Array<string>;

  constructor({
    id,
    title,
    description,
    dateTime,
    mainImage,
    additionalImage,
  }: {
    id?: ID;
    title: string;
    description: string;
    dateTime: string;
    mainImage: string;
    additionalImage?: Array<string>;
  }) {
    super({ id });
    this.title = title;
    this.description = description;
    this.dateTime = dateTime;
    this.mainImage = mainImage;
    this.additionalImage = additionalImage;
  }
}
