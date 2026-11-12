import { resolveMx } from 'node:dns/promises'
import { domainToASCII } from 'node:url'

export function normalizeDomain(input) {
  if (typeof input !== 'string' || !/^[\p{L}\p{N}.-]+$/u.test(input.trim())) return null
  const domain = domainToASCII(input.trim().replace(/\.$/, '')).toLowerCase()
  if (domain.length > 253 || !domain.includes('.') || !/[a-z]$/.test(domain)) return null
  return domain.split('.').every(label => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label)) ? domain : null
}

export async function checkMailDomain(input, lookup = resolveMx) {
  const domain = normalizeDomain(input)
  if (!domain) return { status: 400, error: 'Informe um domínio como empresa.com.br.' }
  try {
    const records = await lookup(domain)
    return { status: 200, domain, mx: records.sort((a, b) => a.priority - b.priority) }
  } catch (error) {
    if (['ENODATA', 'ENOTFOUND'].includes(error.code)) return { status: 200, domain, mx: [] }
    return { status: 503, error: 'A consulta DNS está temporariamente indisponível.' }
  }
}
