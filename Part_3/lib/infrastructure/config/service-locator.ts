import constants from "./constants";
import environment from "./environment";

// Types
import PasswordManager from "../../domain/services/PasswordManager";
import AccessTokenManager from "../../application/security/AccessTokenManager";

import Serializer from "../../interfaces/serializers/Serializer";

import UserRepository from "../../domain/repositories/UserRepository";
import PostRepository from "../../domain/repositories/PostRepository";

// Implementations

import BcryptPasswordManager from "../security/BcryptPasswordManager";
import JwtAccessTokenManager from "../security/JwtAccessTokenManager";

import UserSerializer from "../../interfaces/serializers/UserSerializer";
import PostSerializer from "../../interfaces/serializers/PostSerializer";

// Mongo
import UserRepositoryMongo from "../repositories/mongoose/UserRepositoryMongo";

export type ServiceLocator = {
  passwordManager: PasswordManager;
  accessTokenManager: AccessTokenManager;

  userSerializer: Serializer;
  postSerializer: Serializer;

  userRepository?: UserRepository;
  postRepository?: PostRepository;
};

function buildBeans() {
  const beans: ServiceLocator = {
    passwordManager: new BcryptPasswordManager(),
    accessTokenManager: new JwtAccessTokenManager(),

    userSerializer: new UserSerializer(),
    postSerializer: new PostSerializer(),
  };

  if (environment.database.dialect === constants.SUPPORTED_DATABASE.MONGO) {
    beans.userRepository = new UserRepositoryMongo();
  }

  return beans;
}

export default buildBeans();
