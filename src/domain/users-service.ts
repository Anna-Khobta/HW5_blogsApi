import {UserType} from "../repositories/db";
import {usersRepository} from "../repositories/users-db-repositories";
import e from "express";
import {blogsRepository} from "../repositories/blogs-db-repositories";
import {postsRepositories} from "../repositories/posts-db-repositories";
import {passwordValidation} from "../middlewares/authentication";

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

    async loginUser(checkUserInDb:UserType, loginOrEmail: string, password: string): Promise <UserType | null> {


        const validPassword = bcrypt.compareSync(password, checkUserInDb.password)

        if (!validPassword) {
            return null } else {
            return checkUserInDb
        }

    },

    async deleteUser(id: string): Promise<boolean> {

        return await usersRepository.deleteUser(id)
    },

    async deleteAllUsers(): Promise<boolean> {
        return usersRepository.deleteAllUsers()

    }



}