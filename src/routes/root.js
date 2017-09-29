module.exports = function(app, router) {
  router.use((req, res, next) => {
    console.log('Something is happening.', req.query)
    next()
  })

  router.get('/', (req, res) => {
    const greeting = process.env.GREETING
    res.writeHead(200)
    res.end(greeting)
  })
}
