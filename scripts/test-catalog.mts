import { getServices, getServiceBySlug } from '../lib/services/catalog.ts'
import { closeDb } from '../lib/db/client.ts'

let failed = 0
const check = (name: string, cond: boolean, detail?: unknown) => {
  console.log(`${cond ? '✅' : '❌'} ${name}${!cond && detail !== undefined ? ' — ' + JSON.stringify(detail).slice(0, 200) : ''}`)
  if (!cond) failed++
}

const services = await getServices()
check('getServices() → 6', services.length === 6, services.length)
check('features is array', Array.isArray(services[0].features) && services[0].features.length > 0, services[0])

const bySlug = await getServiceBySlug('custom-web-platforms')
check('getServiceBySlug', bySlug?.title === 'Custom Web Platforms', bySlug)
const inactive = await getServiceBySlug('nope')
check('getServiceBySlug missing → null', inactive === null)

await closeDb()
console.log(failed === 0 ? 'ALL PASS' : `${failed} FAILED`)
process.exit(failed === 0 ? 0 : 1)
