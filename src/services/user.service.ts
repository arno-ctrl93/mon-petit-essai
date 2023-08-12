import { UserInboundDto } from "../objects/dtos/inbound/user.inbound.dto";
import UserEntity from "../objects/entities/user.entity";
import userRepository from "../repositories/user.repository";



async function postUser(userDto: UserInboundDto) {
    console.log("UserService - postUser");

    const userEntity: UserEntity = new UserEntity(userDto.name, userDto.email);

    try {
        const createdUserEntity: UserEntity = await userRepository.postUser(userEntity);
        return;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

async function getUser(email: string) {
    console.log("UserService - getUser");

    try {
        const userEntity: UserEntity = await userRepository.getUser(email);
        return userEntity;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

async function deleteUser(email: string) {
    console.log("UserService - deleteUser");

    try {
        await userRepository.deleteUser(email);
        return;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

async function patchUser(userDto: UserInboundDto) {
    console.log("UserService - patchUser");

    try {
        const userEntity: UserEntity = await userRepository.patchUser(userDto);
        return userEntity;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
    


export default {
    postUser,
    getUser,
    deleteUser,
    patchUser
}