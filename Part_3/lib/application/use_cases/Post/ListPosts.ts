import { ServiceLocator } from "../../../infrastructure/config/service-locator";

export default async ({ postRepository }: ServiceLocator) =>
  postRepository!.find();
