export default defineEventHandler(async (event) => {
  const bus = useEventBus()

  setResponseHeader(event, 'Content-Type', 'text/event-stream')
  setResponseHeader(event, 'Cache-Control', 'no-cache')
  setResponseHeader(event, 'Connection', 'keep-alive')

  const stream = new ReadableStream({
    start(controller) {
      // Send history as init event
      const history = bus.getHistory()
      const initData = JSON.stringify({ type: 'init', events: history })
      controller.enqueue(`data: ${initData}\n\n`)

      // Listen for new events
      const onEvent = (ev: any) => {
        try {
          const data = JSON.stringify({ type: 'event', event: ev })
          controller.enqueue(`data: ${data}\n\n`)
        } catch {
          // stream closed
        }
      }
      bus.on('event', onEvent)

      // Heartbeat every 30s to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(': heartbeat\n\n')
        } catch {
          clearInterval(heartbeat)
        }
      }, 30_000)

      // Cleanup on close
      event.node.req.on('close', () => {
        bus.off('event', onEvent)
        clearInterval(heartbeat)
        try { controller.close() } catch { /* already closed */ }
      })
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  })
})
