import { Router } from 'express'

import getScales from './get'
import postScales from './post'
import putScales from './put'
import patchScales from './patch'
import deleteScales from './delete'


const router = Router()

router.use('/scales', getScales, postScales, putScales, patchScales, deleteScales)


export default router
