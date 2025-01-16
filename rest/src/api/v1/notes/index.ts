import { Router } from 'express'

import getNotes from './get'
import postNotes from './post'


const router = Router()

router.use('/notes', getNotes, postNotes)


export default router
