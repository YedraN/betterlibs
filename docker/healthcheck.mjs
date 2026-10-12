const paths = {
  web: 'http://127.0.0.1:5173/',
  docs: 'http://127.0.0.1:3000/docs',
  storybook: 'http://127.0.0.1:6006/index.json',
}
try {
  // biome-ignore lint/suspicious/noUndeclaredEnvVars: Docker healthcheck, not a cached Turbo task.
  const url = paths[process.env.BETTERLIBS_SERVICE]
  if (!url) process.exit(1)
  const response = await fetch(url, { signal: AbortSignal.timeout(12000) })
  await response.body?.cancel()
  process.exit(response.ok ? 0 : 1)
} catch {
  process.exit(1)
}
