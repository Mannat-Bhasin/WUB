import express from 'express'
import {signUp, logIn } from '../controller/user-auth-controller.js'
import protect from '../middleware/user-middleware.js'


const router = express.Router()

router.post('/signup', signUp)
router.post('/login', logIn)


export default router;
