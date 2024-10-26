import express from 'express'
import v1RouterGet from './v1/get'

const router = express.Router()

router.use('/v1', v1RouterGet)

export default router
