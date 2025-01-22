import { Router } from 'express'

import getTunings from './get'
import postTunings from './post'
import putTunings from './put'
import patchTunings from './patch'
import deleteTunings from './delete'


const router = Router()

router.use('/tunings', getTunings, postTunings, putTunings, patchTunings, deleteTunings)


export default router
