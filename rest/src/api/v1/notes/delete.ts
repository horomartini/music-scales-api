// import type { Request, Response, NextFunction } from 'express'
// import type { Instrument, Note } from 'types/api'
// import type { InstrumentDoc, NoteDoc, ScaleDoc, TuningDoc } from 'types/db'
// import type { ParamId } from 'types/req'

// import express from 'express'
// import mongoose from 'mongoose'

// import { checkIfExist, checkLocalsData } from '../../middleware/request'

// import db from '../../db'

// import { stringToObjectId } from '../../utils/types'


// const router = express.Router()


// router.delete(
//   '/notes/:id',
//   (req: Request<ParamId>, res: Response, next: NextFunction) => {
//     const { id } = req.params
//     res.locals.data = { _id: stringToObjectId(id) } as Pick<NoteDoc, '_id'>
//     res.locals.schema = {
//       _id: { type: mongoose.Types.ObjectId, required: true },
//     }
//     next()
//   },
//   checkLocalsData<Pick<NoteDoc, '_id'>>,
//   async (_: Request, res: Response<{}, { data: Pick<NoteDoc, '_id'>, exists?: NoteDoc }>, next: NextFunction) => {
//     const noteDb = await db.notes.getOne({ _id: res.locals.data._id })

//     if (noteDb !== null)
//       res.locals.exists = noteDb

//     next()
//   },
//   checkIfExist,
//   async (_: Request, res: Response<{}, { data: Pick<NoteDoc, '_id'> }>, next: NextFunction) => {
//     await db.notes.deleteOne(res.locals.data)
//     next()
//   },
//   async (req: Request<{}, {}, {}, { with_content: string }>, res: Response) => {
//     if (req.query.with_content === 'true') 
//       res.status(200).json({ success: true, data: await db.notes.getMany() })
//     else
//       res.sendStatus(204)
//   }
// )

// router.delete(
//   '/instruments/:id',
//   (req: Request<ParamId>, res: Response, next: NextFunction) => {
//     const { id } = req.params
//     res.locals.data = { _id: stringToObjectId(id) } as Pick<InstrumentDoc, '_id'>
//     res.locals.schema = {
//       _id: { type: mongoose.Types.ObjectId, required: true },
//     }
//     next()
//   },
//   checkLocalsData<Pick<InstrumentDoc, '_id'>>,
//   async (_: Request, res: Response<{}, { data: Pick<InstrumentDoc, '_id'>, exists?: InstrumentDoc }>, next: NextFunction) => {
//     const noteDb = await db.instruments.getOne({ _id: res.locals.data._id })

//     if (noteDb !== null)
//       res.locals.exists = noteDb

//     next()
//   },
//   checkIfExist,
//   async (_: Request, res: Response<{}, { data: Pick<InstrumentDoc, '_id'> }>, next: NextFunction) => {
//     await db.instruments.deleteOne(res.locals.data)
//     next()
//   },
//   async (req: Request<{}, {}, {}, { with_content: string }>, res: Response) => {
//     if (req.query.with_content === 'true') 
//       res.status(200).json({ success: true, data: await db.notes.getMany() })
//     else
//       res.sendStatus(204)
//   }
// )

// router.delete(
//   '/tunings/:id',
//   (req: Request<ParamId>, res: Response, next: NextFunction) => {
//     const { id } = req.params
//     res.locals.data = { _id: stringToObjectId(id) } as Pick<TuningDoc, '_id'>
//     res.locals.schema = {
//       _id: { type: mongoose.Types.ObjectId, required: true },
//     }
//     next()
//   },
//   checkLocalsData<Pick<TuningDoc, '_id'>>,
//   async (_: Request, res: Response<{}, { data: Pick<TuningDoc, '_id'>, exists?: TuningDoc }>, next: NextFunction) => {
//     const noteDb = await db.tunings.getOne({ _id: res.locals.data._id })

//     if (noteDb !== null)
//       res.locals.exists = noteDb

//     next()
//   },
//   checkIfExist,
//   async (_: Request, res: Response<{}, { data: Pick<TuningDoc, '_id'> }>, next: NextFunction) => {
//     await db.tunings.deleteOne(res.locals.data)
//     next()
//   },
//   async (req: Request<{}, {}, {}, { with_content: string }>, res: Response) => {
//     if (req.query.with_content === 'true') 
//       res.status(200).json({ success: true, data: await db.notes.getMany() })
//     else
//       res.sendStatus(204)
//   }
// )

// router.delete(
//   '/scales/:id',
//   (req: Request<ParamId>, res: Response, next: NextFunction) => {
//     const { id } = req.params
//     res.locals.data = { _id: stringToObjectId(id) } as Pick<ScaleDoc, '_id'>
//     res.locals.schema = {
//       _id: { type: mongoose.Types.ObjectId, required: true },
//     }
//     next()
//   },
//   checkLocalsData<Pick<ScaleDoc, '_id'>>,
//   async (_: Request, res: Response<{}, { data: Pick<ScaleDoc, '_id'>, exists?: ScaleDoc }>, next: NextFunction) => {
//     const noteDb = await db.scales.getOne({ _id: res.locals.data._id })

//     if (noteDb !== null)
//       res.locals.exists = noteDb

//     next()
//   },
//   checkIfExist,
//   async (_: Request, res: Response<{}, { data: Pick<ScaleDoc, '_id'> }>, next: NextFunction) => {
//     await db.scales.deleteOne(res.locals.data)
//     next()
//   },
//   async (req: Request<{}, {}, {}, { with_content: string }>, res: Response) => {
//     if (req.query.with_content === 'true') 
//       res.status(200).json({ success: true, data: await db.notes.getMany() })
//     else
//       res.sendStatus(204)
//   }
// )


// export default router
