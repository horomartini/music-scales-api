import type { Request, Response } from 'express'

import { Router } from 'express'


const router = Router()

router.get('/healthcheck', (_: Request, res: Response) => {
  res.status(200).json({ success: true })
})


export default router
