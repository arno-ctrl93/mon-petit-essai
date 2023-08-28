import { PrismaClient, User } from "@prisma/client";
import UserEntity, { UserWithGroupAndBets } from "../objects/entities/user.entity";
import { UserInboundDto } from "../objects/dtos/inbound/user.inbound.dto";

const prisma = new PrismaClient();

export type UserGroupJson = {
  user_id: string;
  user_email: string;
  user_name: string;
  total_bets: bigint;
  successful_bets: bigint;
  perfect_bets: bigint;
  total_score: bigint;
}


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

async function getLeaderboardGroup (groupId: string): Promise<UserGroupJson[]> {
  console.log("UserRepository - getLeaderboardGroup");

  try {
    const leaderboard : UserGroupJson[]= await prisma.$queryRaw`
          SELECT
            u.id AS user_id,
            u.name AS user_name,
            u.email AS user_email,
            COUNT(b.id) AS total_bets,
            SUM(
                CASE
                    WHEN (m.team_away_score > m.team_home_score AND b.bet_team_away > b.bet_team_home)
                        OR (m.team_away_score < m.team_home_score AND b.bet_team_away < b.bet_team_home)
                        OR (m.team_away_score = m.team_home_score AND b.bet_team_away = b.bet_team_home) THEN 1
                    ELSE 0
                END
            ) AS successful_bets,
            SUM(
                CASE
                    WHEN m.team_away_score = b.bet_team_away AND m.team_home_score = b.bet_team_home
                        AND b.bet_team_away > b.bet_team_home THEN 1
                    WHEN m.team_away_score = b.bet_team_away AND m.team_home_score = b.bet_team_home
                        AND b.bet_team_away < b.bet_team_home THEN 1
                    WHEN m.team_away_score = b.bet_team_away AND b.bet_team_home = m.team_home_score THEN 1
                    ELSE 0
                END
            ) AS perfect_bets,
            SUM(
                CASE
                    WHEN m.team_away_score > m.team_home_score AND b.bet_team_away > b.bet_team_home THEN
                        CASE
                            WHEN b.bet_team_away = m.team_away_score AND b.bet_team_home = m.team_home_score THEN m.team_away_probability * 2
                            else  m.team_away_probability
                        END
                    WHEN m.team_away_score < m.team_home_score AND b.bet_team_away < b.bet_team_home THEN
                        CASE
                            WHEN b.bet_team_home = m.team_home_score AND b.bet_team_away = m.team_away_score THEN m.team_home_probability * 2
                            else m.team_home_probability
                        end
                    WHEN m.team_away_score = m.team_home_score AND b.bet_team_away = b.bet_team_home THEN
                        CASE
                            WHEN b.bet_team_home = m.team_home_score AND b.bet_team_away = m.team_away_score THEN m.draw_probability  * 2
                            WHEN b.bet_team_home != m.team_home_score or b.bet_team_away != m.team_away_score THEN m.draw_probability 
                        END
                    ELSE 0
                END
            ) AS total_score
        FROM "User" u
        LEFT JOIN "Bet" b ON u.id = b.user_id
        LEFT JOIN "Match" m ON b.match_id = m.id
        WHERE u.group_id = ${groupId} -- Remplace avec l'ID de la ligue souhaitée
        GROUP BY u.id, u.name
        ORDER BY total_score DESC;
    `;
    return leaderboard;
    }
    catch (error) {
    console.log(error);
    throw new Error("UserRepository - getLeaderboardGroup - error");
  }

}


export default {
  postUser,
  getUser,
  deleteUser,
  patchUser,
  joinGroup,
  getUserWithBetMatchTeam,
  getLeaderboardGroup
}