export default defineEventHandler(async () => {
  throw createError({
    statusCode: 501,
    statusMessage: 'Plate-solve not yet implemented'
  })
})
