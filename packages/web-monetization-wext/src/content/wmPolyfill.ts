const events = [
  'monetizationstart',
  'monetizationstop',
  'monetizationpending',
  'tip'
  // Don't log these events
  // 'monetizationprogress'
]

const eventLoggingCode = events
  .map(
    e =>
      `document.monetization.addEventListener('${e}', ` +
      `(e) => console.log(
           '%c Web-Monetization %s event:  %s',
           'color: aqua; background-color: black',
           e.type,
           JSON.stringify(e.detail)) )
          `
  )
  .join(';')

// language=JavaScript
export const wmPolyFillMinimal = `
  document.monetization = document.createElement('div')
  document.monetization.state = 'stopped'
  window.addEventListener('message', function(event) {
    if (event.source === window && event.data.webMonetization) {
      if (event.data.type === 'monetizationstatechange') {
        document.monetization.state = event.data.detail.state
      } else {
        document.monetization.dispatchEvent(
          new CustomEvent(event.data.type, {
            detail: event.data.detail
          }))
      }
    }
  })
`

// language=JavaScript
export const wmPolyfill = `
  ${wmPolyFillMinimal}

  if (localStorage.WM_DEBUG) {
    ${eventLoggingCode}
  }
`

export const includePolyFillMessage = `
Unable to inject \`document.monetization\` polyfill!
Include the polyfill in your page:
<script type="application/javascript">${wmPolyFillMinimal}</script>
`
