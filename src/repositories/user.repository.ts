import { PrismaClient, User } from "@prisma/client";
import UserEntity from "../objects/entities/user.entity";

const prisma = new PrismaClient();


async function postUser(userEntity: UserEntity) {
  console.log("UserRepository - postUser");

  try {
    const user: User = await prisma.user.create({
      data: {
        name: userEntity.name,
        email: userEntity.email
      }
    });

    if (user == null) {
      throw new Error("UserRepository - postUser - created user is null");
    }

    const createdUserEntity: UserEntity = UserEntity.toEntity(user);

    return createdUserEntity;
  }
  catch (error) {
    console.log(error);
    throw error;
  }
}

async function getUser(email: string) {
  console.log("UserRepository - getUser");

  try {
    const user : User | null = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if (user == null) {
      throw new Error("UserRepository - getUser - user not found");
    }

    const userEntity: UserEntity = UserEntity.toEntity(user);
    return userEntity;

  }
  catch (error) {
    console.log(error);
    throw error;
  }
}

async function deleteUser(email: string) {
  console.log("UserRepository - deleteUser");

  try {
    await prisma.user.delete({
      where: {
        email: email
      }
    });
    return;

  }
  catch (error) {
    console.log(error);
    throw error;
  }
}


export default {
  postUser,
  getUser,
  deleteUser
}