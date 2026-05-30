// We will import `Langfuse` dynamically for the getLangfuse function if needed,
// but for type safety or direct usage, let's export an async getter to avoid
// blocking the initial main thread.

export function initObservability() {
  if (import.meta.env.PROD) {
    // Determine user consent if needed or just initialize asynchronously
    // to remove the script evaluation from the critical path

    // Sentry Configuration - Error Tracking
    import('@sentry/react')
      .then((Sentry) => {
        Sentry.init({
          dsn: import.meta.env.VITE_SENTRY_DSN || '',
          integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.replayIntegration({
              maskAllText: true,
              blockAllMedia: true,
            }),
          ],
          tracesSampleRate: 1.0,
          replaysSessionSampleRate: 0.1,
          replaysOnErrorSampleRate: 1.0,
        })
      })
      .catch((err) => console.warn('Failed to load Sentry', err))

    // PostHog Configuration - Product Analytics
    if (import.meta.env.VITE_POSTHOG_KEY) {
      import('posthog-js')
        .then((module) => {
          const posthog = module.default
          posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
            api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
            autocapture: true, // Tracks forms, clicks, and pageviews automatically
            capture_pageview: false, // If managed by React Router later
          })
        })
        .catch((err) => console.warn('Failed to load PostHog', err))
    }
  }
}

// Langfuse Configuration - LLM Observability
// Using `any` type here internally to avoid synchronous `import { Langfuse } from 'langfuse'` overhead.
// A better fix would be a Type-only import or async init wrapper.
let langfuseClient: any = null

export const getLangfuse = async () => {
  if (langfuseClient) return langfuseClient

  if (import.meta.env.VITE_LANGFUSE_PUBLIC_KEY && import.meta.env.VITE_LANGFUSE_SECRET_KEY) {
    const { Langfuse } = await import('langfuse')
    langfuseClient = new Langfuse({
      publicKey: import.meta.env.VITE_LANGFUSE_PUBLIC_KEY,
      secretKey: import.meta.env.VITE_LANGFUSE_SECRET_KEY,
      baseUrl: import.meta.env.VITE_LANGFUSE_BASE_URL || 'https://cloud.langfuse.com',
    })
  }
  return langfuseClient
}
