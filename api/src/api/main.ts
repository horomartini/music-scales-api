import express from 'express'
import v1RouterGet from './v1/get'
import v1RouterPost from './v1/post'

const router = express.Router()

router.use('/v1', v1RouterGet)
router.use('/v1', v1RouterPost)

export default router
