import React from 'react'
import { useTranslation } from 'react-i18next'

interface ErrorFallbackProps {
  error: unknown
  resetErrorBoundary: () => void
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  const { t } = useTranslation()
  const errorMessage = ((): string | null => {
    if (!error) return null
    if (typeof error === 'string') return error
    if (typeof error === 'object' && error !== null && 'message' in error) return String((error as any).message)
    return String(error)
  })()

  return (
    <div className="google-error-container" role="alert">
      <div className="google-error-content">
        <div className="robot-illustration">
          <span className="material-symbols-outlined robot-icon">smart_toy</span>
          <span className="material-symbols-outlined crash-icon">error</span>
        </div>
        <h1>{t('error_fallback.title')}</h1>
        <p className="error-message">{t('error_fallback.message')}</p>
        <p className="error-subtext">{t('error_fallback.subtext')}</p>
        
        {errorMessage && (
          <details className="error-details">
            <summary>{t('error_fallback.details')}</summary>
            <pre>{errorMessage}</pre>
          </details>
        )}

        <button className="google-btn" onClick={resetErrorBoundary}>
          {t('error_fallback.reload')}
        </button>
      </div>
      <style>{`
        .google-error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-family: 'Google Sans', Roboto, Arial, sans-serif;
          background-color: var(--bg-color, #fff);
          color: var(--text-primary, #202124);
          padding: 20px;
          text-align: center;
        }
        .google-error-content {
          max-width: 600px;
          width: 100%;
        }
        .robot-illustration {
          position: relative;
          display: inline-block;
          margin-bottom: 24px;
        }
        .robot-icon {
          font-size: 120px;
          color: #dadce0; /* Google Gray */
        }
        .crash-icon {
          position: absolute;
          top: 0;
          right: -10px;
          font-size: 40px;
          color: #ea4335; /* Google Red */
          background: var(--bg-color, #fff);
          border-radius: 50%;
        }
        h1 {
          font-size: 24px;
          font-weight: 400;
          margin: 0 0 16px;
          color: var(--text-primary, #202124);
        }
        .error-message {
          font-size: 16px;
          color: var(--text-secondary, #5f6368);
          margin-bottom: 8px;
        }
        .error-subtext {
          font-size: 14px;
          color: var(--text-secondary, #5f6368);
          margin-bottom: 24px;
        }
        .error-details {
          margin: 20px auto;
          text-align: left;
          background: rgba(0,0,0,0.03);
          border-radius: 8px;
          padding: 10px;
          font-size: 12px;
          color: #5f6368;
          max-width: 400px;
        }
        .error-details summary {
          cursor: pointer;
          margin-bottom: 8px;
          font-weight: 500;
        }
        .google-btn {
          background-color: #1a73e8;
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 4px;
          font-family: 'Google Sans', Roboto, Arial, sans-serif;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .google-btn:hover {
          background-color: #1557b0;
          box-shadow: 0 1px 2px rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15);
        }
        /* Dark mode support if variables are set */
        @media (prefers-color-scheme: dark) {
          .robot-icon { color: #5f6368; }
          .crash-icon { background: #202124; }
        }
      `}</style>
    </div>
  )
}

export default ErrorFallback
