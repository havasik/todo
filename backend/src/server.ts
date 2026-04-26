import app from './index.js'

const port = Number(process.env.PORT) || 3001

app.listen(port, () => {
  console.log(`[${new Date().toISOString()}] Backend listening on port ${port}`)
})
