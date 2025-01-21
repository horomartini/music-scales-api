import { Router } from 'express'

import getNotes from './get'
import postNotes from './post'
import putNotes from './put'
import patchNotes from './patch'
import deleteNotes from './delete'


const router = Router()

router.use('/notes', getNotes, postNotes, putNotes, patchNotes, deleteNotes)


export default router
