import express from 'express'

import routesV1 from './v1'

import { enforceAcceptAsJson, enforceHeaderContentTypeAsJson } from '../middleware/enforcers'


const router = express.Router()

router.use(enforceAcceptAsJson)
router.use(enforceHeaderContentTypeAsJson)

router.use('/v1', ...routesV1.all)

export default router
