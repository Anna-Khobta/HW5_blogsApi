import {app} from "../../src";
import request from "supertest"
import {blogsRouter} from "../../src/routers/blogs-router";
import any = jasmine.any;

const auth = {login: 'admin', password: 'qwerty'}

// testing Blogs
describe('/', () => {

    beforeAll(async () => {
    await request(app).delete('/testing/all-data')
    })

    it('Post, blog, with authorization', async () => {

        const createdResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${Buffer.from(`${auth.login}:${auth.password}`).toString('base64')}`)
            .send({
                "name": "anna",
                "description": "1 description",
                "websiteUrl": "1google.com"
            })
            .expect(201)

        const createdBlog = createdResponse.body

        const expectedBlog = {
            id: expect.any(String),
            name: "anna",
            description: "1 description",
            websiteUrl: "1google.com",
            "createdAt": createdBlog.createdAt,
            isMembership: false
        }

        expect(createdBlog).toEqual(expectedBlog)


        const getResponse = await request(app)
            .get('/blogs/' + createdBlog.id)
            .expect(200).send(createdBlog)


    })
    it("Post, blog, NO authorization", async () => {

        await request(app)
            .post('/blogs')
            .send({
                "name": "anna",
                "description": "1 description",
                "websiteUrl": "1google.com"
            })
            .expect(401)
    })
    it("Post, blog, error in name", async () => {

        await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${Buffer.from(`${auth.login}:${auth.password}`).toString('base64')}`)
            .send({
                "name": " ",
                "description": "1 description",
                "websiteUrl": "1google.com"
            })
            .expect(400)
    })
    it('Get, all blogs, with pagination', async () => {

        await request(app).delete('/testing/all-data')

        const createdResponse2 = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${Buffer.from(`${auth.login}:${auth.password}`).toString('base64')}`)
            .send({
                "name": "Anna",
                "description": "2 description",
                "websiteUrl": "2google.com"
            })
            .expect(201)
        const createdBlog2 = createdResponse2.body

        const createdResponse3 = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${Buffer.from(`${auth.login}:${auth.password}`).toString('base64')}`)
            .send({
                "name": "Dog",
                "description": "3 description",
                "websiteUrl": "3google.com"
            })
            .expect(201)
        const createdBlog3 = createdResponse3.body

        const createdResponse4 = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${Buffer.from(`${auth.login}:${auth.password}`).toString('base64')}`)
            .send({
                "name": "Cat",
                "description": "4 description",
                "websiteUrl": "4google.com"
            })
            .expect(201)
        const createdBlog4 = createdResponse4.body

        // как создать сразу 10 шт ? функция?
        const itemsExpect = [createdBlog2, createdBlog3, createdBlog4]

        await request(app)
            .get('/blogs?'+'sortDirection=asc'+ '&pageSize=20'+ '&page=2')
            .expect(200,{
                "pagesCount": 1,
                "page": 1,
                "pageSize": 20,
                "totalCount": itemsExpect.length,
                "items": itemsExpect
            })
    })

    it('Create new post for special blog', async () => {

        const createdResponseBlog5 = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${Buffer.from(`${auth.login}:${auth.password}`).toString('base64')}`)
            .send({
                "name": "anna",
                "description": "5 description",
                "websiteUrl": "5google.com"
            })
            .expect(201)
        const createdBlog5 = createdResponseBlog5.body

        const createdResponseForPost5 = await request(app)
            .post('/blogs/' + createdBlog5.id + '/posts')
            .set('Authorization', `Basic ${Buffer.from(`${auth.login}:${auth.password}`).toString('base64')}`)
            .send({
                "title": "Shiro",
                "shortDescription": "Shiro shortDescription",
                "content": "Shiro content"
            })
            .expect(201)
        const createdPost5 = createdResponseForPost5.body

        const expectedPost = {
            "id": expect.any(String),
            "title": "Shiro" || expect.any(String),
            "shortDescription": "shortDescription" || expect.any(String),
            "content": "Shiro content" || expect.any(String),
            "blogId": createdBlog5.id,
            "blogName": createdBlog5.name,
            "createdAt": expect.any(String)
        }

        const getPost5 = await request(app)
            .get('/posts/' + createdPost5.id)
            .expect(200).send(createdPost5)


    })


})

// testing Posts
describe('/', () => {

    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    it("Post, Post, all ok", async () => {

        const createdResponseForBlog = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${Buffer.from(`${auth.login}:${auth.password}`).toString('base64')}`)
            .send({
                "name": "anna",
                "description": "1 description",
                "websiteUrl": "1google.com"
            })
            .expect(201)

        const createdBlog = createdResponseForBlog.body

        const createdResponseForPost = await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${Buffer.from(`${auth.login}:${auth.password}`).toString('base64')}`)
            .send({
                "title": "Shiro",
                "shortDescription": "Shiro shortDescription",
                "content": "Shiro content",
                "blogId": createdBlog.id
            })
            .expect(201)

        const createdPost = createdResponseForPost.body

        const expectedPost = {
            id: expect.any(String),
            "title": "Shiro",
            "shortDescription": "Shiro shortDescription",
            "content": "Shiro content",
            "blogId": createdBlog.id,
            "blogName": createdBlog.name,
            "createdAt": createdPost.createdAt
        }

        expect(createdPost).toEqual(expectedPost)


    })

})



