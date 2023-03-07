import {Request, Response, Router} from "express";

import {authorizationMiddleware} from "../middlewares/authorization";
import {
    loginValidation,
    emailValidation,
    passwordValidation,
    loginOrEmailValidation
} from "../middlewares/authentication";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {getPagination} from "../functions/pagination";


import {usersService} from "../domain/users-service";
import {usersRepository} from "../repositories/users-db-repositories";

export const usersRouter = Router({})



usersRouter.get('/users',
    authorizationMiddleware,
    async (req: Request, res: Response) => {

    const {page, limit, sortDirection, sortBy, searchLoginTerm, searchEmailTerm, skip} = getPagination(req.query)

        const foundUsers = await usersRepository.findUsers(page, limit, sortDirection, sortBy, searchLoginTerm, searchEmailTerm, skip)

        res.status(200).send(foundUsers)
})


usersRouter.post('/users',
    authorizationMiddleware,
    loginValidation,
    emailValidation,
    passwordValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

    let checkUserInDb = await usersRepository.checkUser(req.body.login, req.body.email)

        if (!checkUserInDb) {
            const newUser = await usersService.createUser(req.body.login, req.body.email, req.body.password)
            res.status(201).send(newUser)

        } else {
            return res.send(400)
            // тут по идее надо сделать middleware на проверку
        }
    })

usersRouter.delete('/users/:id',
    authorizationMiddleware,
    async (req: Request, res: Response) => {

    const isDeleted = await usersService.deleteUser(req.params.id)

        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
        }
    })

usersRouter.post("/auth/login",
    loginOrEmailValidation,
    passwordValidation,
    inputValidationMiddleware,
    async (req:Request, res: Response) => {

        let checkUserInDb = await usersRepository.checkUserLoginOrEmail(req.body.loginOrEmail)

        if (checkUserInDb) {

            let login = await usersService.loginUser(checkUserInDb, req.body.loginOrEmail, req.body.password)

            if (login) {
                res.sendStatus(204)
            } else {
                res.sendStatus(401)
            }
        } else {
            res.sendStatus(401)
        }

    })