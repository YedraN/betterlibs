let request: Promise<typeof import('./position-engine')> | undefined
export function loadPositionEngine() {
  request ??= import('./position-engine').catch((error) => {
    request = undefined
    throw error
  })
  return request
}
