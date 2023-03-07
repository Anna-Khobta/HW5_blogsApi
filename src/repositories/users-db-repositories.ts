import {usersCollection, UserType} from "./db";
import {SortDirection} from "mongodb";

export const usersRepository = {

    async checkUser(login: string, email: string): Promise<UserType | null> {

        let foundUser = await usersCollection.findOne({$or: [{login: login}, {email: email}]})

        if (foundUser) {
            return foundUser
        } else {
            return null
        }

    },

    async checkUserLoginOrEmail(loginOrEmail: string): Promise<UserType | null> {

        let foundUser = await usersCollection.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})

        if (foundUser) {
            return foundUser
        } else {
            return null
        }

    },

    async createUser(newUser: UserType): Promise<UserType | null> {

        const insertNewUserInDb = await usersCollection.insertOne(newUser)
        const newUserWithoughtId = await usersCollection.findOne(
            {id: newUser.id}, {projection: {_id: 0, password: 0}})
        return newUserWithoughtId
    },

    async findUsers(page: number,
                    limit: number,
                    sortDirection: SortDirection,
                    sortBy: string,
                    searchLoginTerm: string,
                    searchEmailTerm: string,
                    skip: number) {

        const findUsers = await usersCollection.find(
            {
                $or: [{login: {$regex: searchLoginTerm, $options: 'i'}},
                    {email: {$regex: searchEmailTerm, $options: 'i'}}]
            },
            {projection: {_id: 0, password: 0}})
            .skip(skip)
            .limit(limit)
            .sort({[sortBy]: sortDirection})
            .toArray()

        const total = await usersCollection.countDocuments({
            $or: [{login: {$regex: searchLoginTerm, $options: 'i'}},
                {email: {$regex: searchEmailTerm, $options: 'i'}}]
        })

        const pagesCount = Math.ceil(total / limit)

        return {
            pagesCount: pagesCount,
            page: page,
            pageSize: limit,
            totalCount: total,
            items: findUsers
        }
    },

    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },

    async deleteAllUsers(): Promise<boolean> {
        const result = await usersCollection.deleteMany({})
        return result.acknowledged
    }
}
