import express from 'express'
import apiRouter from './api'

const PORT = process.env.PORT || 8080

const app = express()
app.use(express.json())

app.use('/api', apiRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})