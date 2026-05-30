import * as Sentry from '@sentry/react'
import posthog from 'posthog-js'
import { Langfuse } from 'langfuse'

export function initObservability() {
  if (import.meta.env.PROD) {
    // Sentry Configuration - Error Tracking
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

    // PostHog Configuration - Product Analytics
    if (import.meta.env.VITE_POSTHOG_KEY) {
      posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
        api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
        autocapture: true, // Tracks forms, clicks, and pageviews automatically
        capture_pageview: false, // If managed by React Router later
      })
    } else {
      console.warn('[Observability] VITE_POSTHOG_KEY is missing. PostHog will not be initialized.')
    }
  }
}

// Langfuse Configuration - LLM Observability
let langfuseClient: Langfuse | null = null

if (import.meta.env.VITE_LANGFUSE_PUBLIC_KEY && import.meta.env.VITE_LANGFUSE_SECRET_KEY) {
  langfuseClient = new Langfuse({
    publicKey: import.meta.env.VITE_LANGFUSE_PUBLIC_KEY,
    secretKey: import.meta.env.VITE_LANGFUSE_SECRET_KEY,
    baseUrl: import.meta.env.VITE_LANGFUSE_BASE_URL || 'https://cloud.langfuse.com',
  })
} else {
  console.warn('[Observability] VITE_LANGFUSE keys are missing. Langfuse will not be initialized.')
}

export const getLangfuse = () => langfuseClient
