import { Request, Response } from "express";
import { ValidationError } from "joi";
import GetPost from "../../application/use_cases/Post/GetPost";
import { ServiceLocator } from "../../infrastructure/config/service-locator";
import Post from "../../domain/entities/Post";
import ListPosts from "../../application/use_cases/Post/ListPosts";
import CreatePost from "../../application/use_cases/Post/CreatePost";
import DeletePost from "../../application/use_cases/Post/DeletePost";
import UpdatePost from "../../application/use_cases/Post/UpdatePost";

export default {
  async findPosts(request: Request, response: Response) {
    // Context
    const serviceLocator: ServiceLocator = request.serviceLocator!;

    // Treatment
    const posts = await ListPosts(serviceLocator);

    // Output
    const output = posts.map((post: Post) =>
      serviceLocator.postSerializer.serialize(post, serviceLocator)
    );
    return response.json(output);
  },

  async getPost(request: Request, response: Response) {
    // Context
    const serviceLocator: ServiceLocator = request.serviceLocator!;

    // Input
    const postId = request.params.id;

    // Treatment
    let post = null;
    try {
      post = await GetPost(postId, serviceLocator);
    } catch (err) {
      console.log(err);
    }

    // Output
    if (!post) {
      return response.status(404).json({ message: "Not Found" });
    }
    const output = serviceLocator.postSerializer.serialize(
      post,
      serviceLocator
    );
    return response.json(output);
  },

  async createPost(request: Request, response: Response) {
    // Context
    const serviceLocator: ServiceLocator = request.serviceLocator!;

    // Input
    let data = request.body;
    data = {
      title: data.title,
      description: data.description,
      dateTime: data.dateTime,
      mainImage: data.mainImage,
      additionalImage: data.additionalImage,
    };

    // Treatment
    let post = null;
    let error = null;
    try {
      post = await CreatePost(data, serviceLocator);
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        error = err.details[0].message;
      } else if (err instanceof Error) {
        // 'Error occurred while creating user'
        error = err.message;
      }
    }

    // Output
    if (!post) {
      return response.status(400).json({ message: error });
    }
    const output = serviceLocator.postSerializer.serialize(
      post,
      serviceLocator
    );
    return response.status(201).json(output);
  },

  async updatePost(request: Request, response: Response) {
    // Context
    const serviceLocator: ServiceLocator = request.serviceLocator!;

    // Input
    const postId = request.params.id;
    const inputData = request.body;
    const data: any = {
      id: postId,
    };
    const acceptedFields: string[][] = [
      ["main_image", "mainImage"],
      ["additional_images", "additionalImage"],
      ["title"],
      ["description"],
      ["date_time", "dateTime"],
    ];
    acceptedFields.forEach((acceptedField) => {
      if (inputData[acceptedField[0]] === undefined) return;
      data[acceptedField.length > 1 ? acceptedField[1] : acceptedField[0]] =
        inputData[acceptedField[0]];
    });

    // Treatment
    let post = null;
    let error = null;
    try {
      post = await UpdatePost(data, serviceLocator);
    } catch (err) {
      if (err instanceof ValidationError) {
        error = err.details[0].message;
      } else if (err instanceof Error) {
        // 'Error occurred while creating user'
        error = err.message;
      }
    }

    // Output
    if (!post) {
      return response.status(400).json({ message: error });
    }
    const output = serviceLocator.postSerializer.serialize(
      post,
      serviceLocator
    );
    return response.json(output);
  },

  async deletePost(request: Request, response: Response) {
    // Context
    const serviceLocator: ServiceLocator = request.serviceLocator!;

    // Input
    const toDeletePostId = request.params.id;

    // ---------------------------------------------
    // THIS IS HOW TO ACCESS userId FROM AccessToken
    // ---------------------------------------------
    const postId = request.userId;
    // ---------------------------------------------
    // ---------------------------------------------

    // Treatment
    let post = null;
    try {
      post = await DeletePost(toDeletePostId, serviceLocator);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(err);
      }
    }

    // Output
    if (!post) {
      return response.status(404).json({ message: "Not Found" });
    }
    return response.sendStatus(204);
  },
};
