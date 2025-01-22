import { Router } from 'express'

import getInstruments from './get'
import postInstruments from './post'
import putInstruments from './put'
import patchInstruments from './patch'
import deleteInstruments from './delete'


const router = Router()

router.use('/instruments', getInstruments, postInstruments, putInstruments, patchInstruments, deleteInstruments)


export default router