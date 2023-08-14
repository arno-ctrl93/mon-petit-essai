import { PrismaClient, User } from "@prisma/client";
import UserEntity, { UserWithGroupAndBets } from "../objects/entities/user.entity";
import { UserInboundDto } from "../objects/dtos/inbound/user.inbound.dto";

const prisma = new PrismaClient();


async function postUser(userDto: UserInboundDto) {
  console.log("UserRepository - postUser");

  try {
    const user: User = await prisma.user.create({
      data: {
        name: userDto.name,
        email: userDto.email
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
    const user: User | null = await prisma.user.findUnique({
      where: {
        email: email
      },
      include: {
        group: true
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

async function patchUser(userDto: UserInboundDto) {
  console.log("UserRepository - patchUser");

  try {
    const user: User | null = await prisma.user.update({
      where: {
        email: userDto.email
      },
      data: {
        name: userDto.name,
      }
    });

    if (user == null) {
      throw new Error("UserRepository - patchUser - user not found");
    }

    const updatedUserEntity: UserEntity = UserEntity.toEntity(user);
    return updatedUserEntity;
  }
  catch (error) {
    console.log(error);
    throw error;
  }
}

async function joinGroup(userId: string, groupId: string) {
  console.log("UserRepository - joinGroup");

  try {
    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        group_id: groupId
      }
    });
  }
  catch (error) {
    console.log(error);
    throw new Error("UserRepository - joinGroup - error");
  }
}

async function getUserWithBetMatchTeam(userEmail: string) {
  console.log("UserRepository - getUserWithBetMatchTeam");

  try {
    const user: UserWithGroupAndBets | null = await prisma.user.findUnique({
      where: {
        email: userEmail
      },
      include: {
        group: true,
        bets: {
          include: {
            match: {
              include: {
                team_away: true,
                team_home: true
              }
            }
          }
        }
      }
    });

    console.log(user);

    if (user == null) {
      throw new Error("UserRepository - getUserWithBetMatchTeam - user not found");
    }

    const userEntity: UserEntity = UserEntity.toEntity(user);
    return userEntity;
  }
  catch (error) {
    console.log(error);
    throw new Error("UserRepository - getUserWithBetMatchTeam - error");
  }
}


export default {
  postUser,
  getUser,
  deleteUser,
  patchUser,
  joinGroup,
  getUserWithBetMatchTeam
}