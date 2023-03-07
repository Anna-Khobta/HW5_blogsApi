import {Request, Response, Router} from "express";

import {blogsRepository} from "../repositories/blogs-db-repositories";
import {postsCollection} from "../repositories/db";
import {postsRepositories} from "../repositories/posts-db-repositories";
import {blogsService} from "../domain/blogs-service";
import {postsService} from "../domain/posts-service";

export const deleteAllRouter = Router({})

deleteAllRouter.delete('/testing/all-data',

    async (req: Request, res: Response ) => {

        const deleteAllBlogs = await blogsService.deleteAllBlogs()

        const deleteAllPosts = await postsService.deleteAllPosts()

        if (deleteAllBlogs) {
            if (deleteAllPosts) {
                res.sendStatus(204)
            }
        } else {
            res.sendStatus(404)
        }
    })


