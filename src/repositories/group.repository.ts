import { Group, PrismaClient } from "@prisma/client";
import GroupEntity from "../objects/entities/group.entity";
import { CreateGroupInboundDto } from "../objects/dtos/inbound/create-group.inbound.dto";
import hashIdMisc from "../helper/hash-id.misc";

const prisma = new PrismaClient();


export type UserGroupJson = {
    user_name: string;
    correct_bets: bigint;
    closed_bets: bigint;
    perfect_bets: bigint;
    total_score: bigint;
}


async function createGroup(dto: CreateGroupInboundDto, userId: string) {
    console.log("GroupRepository - createGroup");

    try {
        const group: Group = await prisma.group.create({
            data: {
                name: dto.groupName,
                unique_public_id: hashIdMisc.generateUniqueGroupId(userId),
                owner_id: userId
            }
        });

        const groupEntity: GroupEntity = GroupEntity.toEntity(group);

        return groupEntity;
    }
    catch (error) {
        console.log(error);
        throw error;
    }

}

async function getGroupByUniqueId(uniqueId: string) {
    console.log("GroupRepository - getGroupByUniqueId");

    try {
        const group: Group | null = await prisma.group.findUnique({
            where: {
                unique_public_id: uniqueId
            }
        });

        if (group == null) {
            throw new Error("GroupRepository - getGroupByUniqueId - group not found");
        }

        const groupEntity: GroupEntity = GroupEntity.toEntity(group);
        return groupEntity;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

async function getLeaderboardGroup(uniqueId: string) {
    console.log("GroupRepository - getLeaderboardGroup");

    try {
        const leaderboard: UserGroupJson[] = await prisma.$queryRaw`
        SELECT
            u.name AS user_name,
            SUM(b.bet_score) AS total_score,
            COUNT(CASE WHEN b.bet_score <> 0 AND b.bet_score_diff = 0 THEN 1 END) AS perfect_bets,
            COUNT(CASE WHEN b.bet_score <> 0 AND b.bet_score_diff <= 7 AND b.bet_score_diff != 0 THEN 1 END) AS closed_bets,
            COUNT(CASE WHEN b.bet_score <> 0 AND b.bet_score_diff > 7 THEN 1 END) AS correct_bets
        FROM public."User" u
        LEFT JOIN public."Bet" b ON u.id = b.user_id
        JOIN public."Group" g ON u.group_id = g.id
        WHERE g.unique_public_id = ${uniqueId}
        GROUP BY u.id, u.name
        ORDER BY total_score DESC;
        `;

        console.log(leaderboard);
        return leaderboard;
    } catch (error) {
        console.log(error);
        throw new Error("UserRepository - getLeaderboardGroup - error");
    }

}

export default {
    createGroup,
    getGroupByUniqueId,
    getLeaderboardGroup
}