import express from 'express'

import v1RouterGet from './v1/get'
import v1RouterPost from './v1/post'

import { enforceAcceptAsJson, enforceHeaderContentTypeAsJson } from '../middleware/enforcers'


const router = express.Router()

router.use(enforceAcceptAsJson)
router.use(enforceHeaderContentTypeAsJson)

router.use('/v1', v1RouterGet)
router.use('/v1', v1RouterPost)

export default router
