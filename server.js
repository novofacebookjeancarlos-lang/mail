import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { checkMailDomain } from './dns.js'

const page = await readFile(new URL('./public/index.html', import.meta.url))
const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost')
  response.setHeader('X-Content-Type-Options', 'nosniff')
  if (request.method === 'GET' && url.pathname === '/') {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(page)
    return
  }
  let result = { status: 404, error: 'Página indisponível.' }
  if (request.method === 'GET' && url.pathname === '/health') result = { status: 200, ok: true }
  if (request.method === 'GET' && url.pathname === '/api/dominio') {
    result = await checkMailDomain(url.searchParams.get('dominio'))
  }
  const { status, ...body } = result
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  response.end(JSON.stringify(body))
})
server.listen(Number(process.env.PORT || 3000), process.env.HOST || '127.0.0.1')
