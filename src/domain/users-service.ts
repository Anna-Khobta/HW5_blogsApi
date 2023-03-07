import {UserType} from "../repositories/db";
import {usersRepository} from "../repositories/users-db-repositories";
import e from "express";
import {blogsRepository} from "../repositories/blogs-db-repositories";

const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(5);


export const usersService= {

    async createUser(login:string, email:string, password: string): Promise <UserType | null> {


        const hashPassword = bcrypt.hashSync(password, salt);

        const newUser = {
            id: (+(new Date())).toString(),
            login: login,
            email: email,
            password: hashPassword,
            createdAt: (new Date()).toISOString()
        }

        const newUserWithoughtId = await usersRepository.createUser(newUser)
        return newUserWithoughtId

    },

    async deleteUser(id: string): Promise<boolean> {

        return await usersRepository.deleteUser(id)
    },


}