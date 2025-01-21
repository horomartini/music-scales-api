import express from 'express'

import notes from './v1/notes'
import scales from './v1/scales'

import { enforceAcceptAsJson, enforceHeaderContentTypeAsJson } from '../middleware/enforcers'


const router = express.Router()

router.use(enforceAcceptAsJson)
router.use(enforceHeaderContentTypeAsJson)

router.use('/v1', notes, scales)


export default router
