import * as dotenv from 'dotenv'
dotenv.config()
import express, {Request, Response} from 'express'

import {blogsRouter} from "./routers/blogs-router";
import {postsRouter} from "./routers/posts-router";
import {deleteAllRouter} from "./routers/delete-all-routers";




// create express app
export const app = express()
const port =  3004

//process.env.PORT ||

app.use(express.json())

app.get('/', (req: Request, res: Response ) => {
    let helloMessage = 'Hello Samurai!!!'
    res.send(helloMessage)
})

app.use('/', blogsRouter)
app.use('/', postsRouter)
app.use('/', deleteAllRouter)

//start app
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})