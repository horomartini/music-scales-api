import express from 'express'

const PORT = process.env.PORT || 8080

const app = express()
app.use(express.json())

app.get('/api/test', (req, res) => {
    res.json({ message: 'test' })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})