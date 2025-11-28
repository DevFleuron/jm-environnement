import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import morgan from 'morgan'

import healthRoutes from './routes/health.routes.js'
import filesRoutes from './routes/files.routes.js'

const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

const PORT = process.env.PORT || 3005

app.use('/api', healthRoutes)
app.use('/api/files', filesRoutes)

app.use((err, req, res, next) => {
  console.error(err)

  if (err.name === 'MulterError') {
    return res.status(400).json({ message: err.message })
  }

  res.status(500).json({
    message: err.message || 'Erreur serveur',
  })
})

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`)
})
