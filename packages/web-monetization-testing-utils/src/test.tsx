import { MonetizationExtendedDocument } from '@web-monetization/types'

import { MonetizationImplTest } from './index'

function makeLogger(logElSelector: string) {
  const logEl = document.querySelector(logElSelector)
  if (!logEl) {
    throw new Error(`missing #log element in document`)
  }
  return (s: string, prefix = false) => {
    if (prefix) {
      logEl.innerHTML = `${s}\n${logEl.innerHTML}`
    } else {
      logEl.innerHTML += `${s}\n`
    }
    console.log('LOG:', s)
  }
}

;(async function main() {
  const log = makeLogger('#log')

  const suite = new MonetizationImplTest(
    document as MonetizationExtendedDocument,
    window,
    log
  )

  try {
    await suite.test()
    log('<strong>all tests passed!</strong>\n', true)
    log('\n<strong>all tests passed!</strong>', false)
  } catch (e) {
    log('')
    log('Last Error:')
    log(e.message)
  }
})()
