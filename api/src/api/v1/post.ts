import express from 'express'
import db from '../../db/sample-db'
import { IScale } from 'api-types'
import { isScale } from '../../utils/types'

const router = express.Router()

router.post('/scales', (req, res) => {
  try {
    const body: IScale = req.body

    if (!isScale(body)) {
      res
        .status(400)
        .json({  }) // TODO: send params of object IScale
      return
    }

    // TODO: add to db

    res
      .status(201)
      .json({})
    
  } catch (error) {
    res
      .status(500)
      .json({ error: '＼（〇_ｏ）／' })
  }
})

export default router
