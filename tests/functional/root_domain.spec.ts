import { test } from '@japa/runner'

const ROOT_URL = 'https://heliospressing.com/'

test('root domain responds', async ({ assert }) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const response = await fetch(ROOT_URL, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
    })

    assert.isTrue(
      response.status >= 200 && response.status < 400,
      `Expected 2xx/3xx status from ${ROOT_URL}, got ${response.status}`
    )
  } finally {
    clearTimeout(timeout)
  }
})
