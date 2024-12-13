import express from 'express'

import v1RouterGet from './v1/get'
import v1RouterPost from './v1/post'
import v1RouterPut from './v1/put'
import v1RouterPatch from './v1/patch'
import v1RouterDelete from './v1/delete'

import { enforceAcceptAsJson, enforceHeaderContentTypeAsJson } from '../middleware/enforcers'


const router = express.Router()

router.use(enforceAcceptAsJson)
router.use(enforceHeaderContentTypeAsJson)

router.use('/v1', v1RouterGet)
router.use('/v1', v1RouterPost)
router.use('/v1', v1RouterPut)
router.use('/v1', v1RouterPatch)
router.use('/v1', v1RouterDelete)

export default router
