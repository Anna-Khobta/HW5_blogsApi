import {body} from "express-validator";

export const loginValidation = body("login")
    .trim().not().isEmpty().withMessage("The login is empty")
    .isLength({min:3, max:10}).withMessage("The length should be minimum 3, maximum 10")
    .matches(/^[a-zA-Z0-9_-]*$/)

export const passwordValidation = body("password")
    .trim().not().isEmpty().withMessage("The password is empty")
    .isLength({min:6, max: 20}).withMessage("The length should be minimum 6, maximum 20")

export const emailValidation = body("email")
    .trim().not().isEmpty().withMessage("The email is empty")
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)

// .isEmail()

export const loginOrEmailValidation = body("loginOrEmail")
    .trim().not().isEmpty().withMessage("The loginOrEmail is empty")
    .isLength({min:3, max:50}).withMessage("Error in length")


