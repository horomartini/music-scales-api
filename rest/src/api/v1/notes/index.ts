import type { NextFunction, Request, Response } from 'express'

import { Router } from 'express'

import getNotes from './get'


const router = Router()

router.use('/notes', getNotes)


export default router
