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


export default {
  postUser
}