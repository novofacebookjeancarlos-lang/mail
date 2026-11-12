import { test } from 'node:test'
import assert from 'node:assert/strict'
import { normalizeDomain, checkMailDomain } from './dns.js'

test('valida e normaliza domínio', () => {
  assert.equal(normalizeDomain(' Empresa.COM.BR. '), 'empresa.com.br')
  for (const value of ['https://empresa.com.br', 'contato@empresa.com.br', '127.0.0.1', '-teste.com.br']) {
    assert.equal(normalizeDomain(value), null)
  }
})

test('ordena MX, distingue ausência de falha no DNS', async () => {
  const found = await checkMailDomain('empresa.com.br', async () => [
    { exchange: 'b.example', priority: 20 }, { exchange: 'a.example', priority: 10 },
  ])
  assert.equal(found.mx[0].exchange, 'a.example')
  const failure = code => async () => { throw Object.assign(new Error(), { code }) }
  assert.deepEqual((await checkMailDomain('empresa.com.br', failure('ENODATA'))).mx, [])
  assert.equal((await checkMailDomain('empresa.com.br', failure('ETIMEOUT'))).status, 503)
})
