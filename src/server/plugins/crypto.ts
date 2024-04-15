// Ensures that the crypto module is available on the server side,
// Fixes the error: `ReferenceError: crypto is not defined` on older versions
// of Node.js

export default defineNitroPlugin(async () => {
  if (!process.server) return
  if (typeof global.crypto !== 'undefined') return

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const crypto = await import('crypto')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.crypto = crypto
})
