import {Request, Response, Router} from "express";

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


