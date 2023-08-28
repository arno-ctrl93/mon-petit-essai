import createOrUpdateBetInboundDto from "../objects/dtos/inbound/create-or-update-bet.inbound.dto";
import betRepository from "../repositories/bet.repository";
import matchRepository from "../repositories/match.repository";
import userRepository from "../repositories/user.repository";


async function createOrUpdateBet(dto: createOrUpdateBetInboundDto) {
    console.log("BetService - createOrUpdateBet");

    const user = await userRepository.getUser(dto.userEmail);
    const match = await matchRepository.getMatchByApiIdOrNull(dto.matchApiId)

    if (user == null) {
        throw new Error("BetService - createOrUpdateBet - user not found");
    }

    if (match == null) {
        throw new Error("BetService - createOrUpdateBet - match not found");
    }

    if (match.getStartedAt() < new Date()) {
        throw new Error("BetService - createOrUpdateBet - match already started");
    }

    await betRepository.getBetByUserAndMatchIdOrNull(user.getId(), match.getId()).then(async (betEntity) => {
        if (betEntity == null) {
            const createdBetEntity = await betRepository.createBet(dto, user.getId(), match.getId());
            return createdBetEntity;
        }

        if (betEntity.getBetHomeTeam() != dto.betHomeTeam || betEntity.getBetAwayTeam() != dto.betAwayTeam) {
            const updatedBetEntity = await betRepository.updateBet(dto, betEntity.getId());
            return updatedBetEntity;
        }
        return betEntity;
    }).catch((error) => {
        console.log(error);
        throw error;
    });
}

export default {
    createOrUpdateBet
}
