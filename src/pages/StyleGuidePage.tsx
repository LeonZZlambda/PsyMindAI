import React, { useState } from 'react'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import Footer from '@/components/layout/Footer'
import ScrollToTopButton from '@/components/ui/ScrollToTopButton'
import LandingHeader from '@/components/layout/LandingHeader'
import '../styles/styleguide.css'

const StyleGuidePage: React.FC = () => {
  const { t } = useTranslation()
  const [fontScale, setFontScale] = useState<'normal' | 'large'>('normal')
  const [selectedSnippet, setSelectedSnippet] = useState<'button' | 'card' | 'input' | 'modal'>('button')

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard!`)
  }

  const designTokens = [
    { name: '--primary-color', value: '#00796B', desc: 'Serene Focus Teal', type: 'color', preview: '#00796B' },
    { name: '--secondary-color', value: '#F1F3F4', desc: 'Muted Neutral Grey', type: 'color', preview: '#F1F3F4' },
    { name: '--background-color', value: '#FFFFFF', desc: 'Main Page Ground', type: 'color', preview: '#FFFFFF' },
    { name: '--radius-lg', value: '24px', desc: 'Premium Rounded Panels', type: 'radius', preview: '24px' },
    { name: '--radius-md', value: '12px', desc: 'Standard Element Corners', type: 'radius', preview: '12px' },
    { name: '--shadow-soft', value: '0 4px 20px rgba(0,0,0,0.06)', desc: 'Smooth Visual Elevation', type: 'shadow', preview: '0 4px 20px rgba(0,0,0,0.06)' },
    { name: '--transition-fast', value: '180ms ease-out', desc: 'Snappy UI Reactions', type: 'transition', preview: '180ms' }
  ]

  const motionRules = [
    { name: 'Hover Scale', value: 'scale(1.02)', desc: 'Subtle hover response to invite click actions without distraction' },
    { name: 'Transition Timing', value: '180ms ease-out', desc: 'Snappy interactive animations for focus and element scaling' },
    { name: 'Entrance Fades', value: '240ms ease-in-out', desc: 'Soft opacity and translate staggerings using Framer Motion' },
    { name: 'Reduced Motion Override', value: '0ms / opacity-only', desc: 'Dynamic timing removal when system prefers-reduced-motion is true' }
  ]

  const codeSnippets = {
    button: {
      title: 'Interactive Ripple Button',
      jsx: `<button \n  className="btn-primary ripple-effect"\n  onClick={handleClick}\n>\n  {t('common.continue')}\n  <span className="material-symbols-outlined">arrow_forward</span>\n</button>`,
      css: `.btn-primary {\n  background: var(--primary-color);\n  color: #fff;\n  border-radius: var(--radius-md);\n  padding: 12px 24px;\n  transition: transform var(--transition-fast);\n}\n.btn-primary:hover {\n  transform: scale(1.02);\n}`
    },
    card: {
      title: 'Glassmorphic Card Panel',
      jsx: `<div className="glass-card">\n  <h3>Card Heading</h3>\n  <p>Self-regulation indicators and context summary go here.</p>\n</div>`,
      css: `.glass-card {\n  background: rgba(255, 255, 255, 0.7);\n  backdrop-filter: blur(12px);\n  border: 1px solid var(--border-color);\n  border-radius: var(--radius-lg);\n  padding: 24px;\n  box-shadow: var(--shadow-soft);\n}`
    },
    input: {
      title: 'Accessible TextInput Field',
      jsx: `<div className="input-group">\n  <label htmlFor="user-input">Core Query</label>\n  <input \n    id="user-input"\n    type="text" \n    className="sg-input" \n    placeholder="Type something..." \n  />\n</div>`,
      css: `.sg-input {\n  width: 100%;\n  padding: 14px 16px;\n  border: 1px solid var(--border-color);\n  border-radius: var(--radius-md);\n  outline: none;\n}\n.sg-input:focus {\n  border-color: var(--primary-color);\n  box-shadow: 0 0 0 3px rgba(0, 121, 107, 0.15);\n}`
    },
    modal: {
      title: 'Modal Overlay Container',
      jsx: `<div className="modal-backdrop" onClick={onClose}>\n  <m.div \n    className="modal-container" \n    initial={{ opacity: 0, y: 15 }} \n    animate={{ opacity: 1, y: 0 }}\n  >\n    <h2>Modal Content</h2>\n  </m.div>\n</div>`,
      css: `.modal-backdrop {\n  position: fixed;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.4);\n  backdrop-filter: blur(4px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}`
    }
  }

  const iconsList = ['psychology', 'timer', 'chat', 'shield', 'bar_chart', 'menu', 'close', 'settings', 'arrow_forward', 'check_circle', 'error', 'language']

  return (
    <m.div 
      className="landing-page styleguide-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <LandingHeader />

      <main className="styleguide-content">
        <div className="styleguide-header">
          <h1>{t('style_guide.page_title')}</h1>
          <p>{t('style_guide.page_subtitle')}</p>
        </div>

        {/* 1. DESIGN TOKENS SYSTEM */}
        <section className="sg-section">
          <h2>
            <span className="material-symbols-outlined">schema</span> 
            Design Tokens System
          </h2>
          <p>The visual framework maps design tokens directly to CSS variables to guarantee consistent margins, rounded corners, and animations across screen scopes.</p>
          
          <div className="tokens-table-container">
            <table className="tokens-table">
              <thead>
                <tr>
                  <th>Token Variable</th>
                  <th>Configured Value</th>
                  <th>Role / Description</th>
                  <th>Visual Reference</th>
                </tr>
              </thead>
              <tbody>
                {designTokens.map((token, idx) => (
                  <tr key={idx} className="token-row" onClick={() => copyToClipboard(token.name, token.name)}>
                    <td><code>{token.name}</code></td>
                    <td><code>{token.value}</code></td>
                    <td>{token.desc}</td>
                    <td>
                      {token.type === 'color' && (
                        <div className="token-preview-color" style={{ backgroundColor: token.preview }} />
                      )}
                      {token.type === 'radius' && (
                        <div className="token-preview-radius" style={{ borderRadius: token.preview }} />
                      )}
                      {token.type === 'shadow' && (
                        <div className="token-preview-shadow" style={{ boxShadow: token.preview }} />
                      )}
                      {token.type === 'transition' && (
                        <div className="token-preview-transition" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 2. COLOR PALETTE */}
        <section className="sg-section">
          <h2>
            <span className="material-symbols-outlined">palette</span> 
            {t('style_guide.sections.palette.title')}
          </h2>
          <p>{t('style_guide.sections.palette.intro')}</p>
          
          <div className="color-grid">
            <div className="color-card primary" onClick={() => copyToClipboard('var(--primary-color)', 'Primary Teal')}>
              <div className="color-swatch"></div>
              <div className="color-info">
                <strong>{t('style_guide.sections.palette.cards.primary')}</strong>
                <code>var(--primary-color)</code>
              </div>
            </div>
            
            <div className="color-card background" onClick={() => copyToClipboard('var(--background-color)', 'Background color')}>
              <div className="color-swatch"></div>
              <div className="color-info">
                <strong>{t('style_guide.sections.palette.cards.background')}</strong>
                <code>var(--background-color)</code>
              </div>
            </div>

            <div className="color-card secondary" onClick={() => copyToClipboard('var(--secondary-color)', 'Secondary panel color')}>
              <div className="color-swatch"></div>
              <div className="color-info">
                <strong>{t('style_guide.sections.palette.cards.secondary')}</strong>
                <code>var(--secondary-color)</code>
              </div>
            </div>

            <div className="color-card text" onClick={() => copyToClipboard('var(--text-color)', 'Text Contrast color')}>
              <div className="color-swatch"></div>
              <div className="color-info">
                <strong>{t('style_guide.sections.palette.cards.text')}</strong>
                <code>var(--text-color)</code>
              </div>
            </div>
            
            <div className="color-card gradient" onClick={() => copyToClipboard('linear-gradient(135deg, var(--gradient-start), var(--gradient-mid), var(--gradient-end))', 'Brand Gradient')}>
              <div className="color-swatch"></div>
              <div className="color-info">
                <strong>{t('style_guide.sections.palette.cards.gradient')}</strong>
                <code>linear-gradient(135deg, ...)</code>
              </div>
            </div>
          </div>
        </section>

        {/* 3. MOTION SYSTEM */}
        <section className="sg-section">
          <h2>
            <span className="material-symbols-outlined">motion_sensor_active</span> 
            Motion & Animation Guidelines
          </h2>
          <p>Animations follow a strict motion model built around accessibility guidelines, optimizing performance using hardware transitions.</p>
          
          <div className="motion-grid">
            {motionRules.map((rule, idx) => (
              <div key={idx} className="motion-card">
                <h4>{rule.name}</h4>
                <code>{rule.value}</code>
                <p>{rule.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. TYPOGRAPHY SYSTEM */}
        <section className="sg-section">
          <div className="section-header-row">
            <h2>
              <span className="material-symbols-outlined">title</span> 
              Typography System
            </h2>
            <div className="font-scale-control">
              <button 
                className={`scale-btn ${fontScale === 'normal' ? 'active' : ''}`}
                onClick={() => setFontScale('normal')}
              >
                Normal Scale
              </button>
              <button 
                className={`scale-btn ${fontScale === 'large' ? 'active' : ''}`}
                onClick={() => setFontScale('large')}
              >
                Accessibility Large
              </button>
            </div>
          </div>
          <p>Our typographic system matches readability constraints, dynamically scaling base size parameters based on accessibility configurations.</p>
          
          <div className={`typo-showcase font-scale-${fontScale}`}>
            <div className="typo-item">
              <h1>H1 Heading Title (Outfit/Inter)</h1>
              <code>font-size: 2.5rem | font-weight: 700</code>
            </div>
            <div className="typo-item">
              <h2>H2 Section Title (Outfit/Inter)</h2>
              <code>font-size: 1.8rem | font-weight: 600</code>
            </div>
            <div className="typo-item">
              <h3>H3 Card Title (Outfit/Inter)</h3>
              <code>font-size: 1.4rem | font-weight: 500</code>
            </div>
            <div className="typo-item">
              <p>Body paragraph text context mapping. PsyMind.AI provides client-side cognitive diagnostics and supportive educational tools.</p>
              <code>font-size: 1.0rem | font-weight: 400</code>
            </div>
            <div className="typo-item">
              <code>monospace code snippet block</code>
              <code>font-family: monospace | font-size: 13px</code>
            </div>
          </div>
        </section>

        {/* 5. INTERACTIVE COMPONENT SHOWCASE & SNIPPETS */}
        <section className="sg-section">
          <h2>
            <span className="material-symbols-outlined">extension</span> 
            Interactive Previews & Snippets
          </h2>
          <p>Select a component category below to check its live interface rendering and copy its complete JSX or CSS definitions.</p>

          <div className="snippets-tabs">
            {(Object.keys(codeSnippets) as Array<keyof typeof codeSnippets>).map((key) => (
              <button 
                key={key} 
                className={`snippet-tab-btn ${selectedSnippet === key ? 'active' : ''}`}
                onClick={() => setSelectedSnippet(key)}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>

          <div className="snippet-display-grid">
            <div className="snippet-preview-column">
              <h4>Live Preview</h4>
              <div className="live-preview-box">
                {selectedSnippet === 'button' && (
                  <button className="sg-preview-button ripple-effect">
                    Interactive Action
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                )}
                {selectedSnippet === 'card' && (
                  <div className="sg-preview-card">
                    <h5>Glassmorphic Box</h5>
                    <p>Visual card displaying structural diagnostic logs.</p>
                  </div>
                )}
                {selectedSnippet === 'input' && (
                  <div className="input-group" style={{ width: '100%' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--primary-color)', marginBottom: '6px', display: 'block' }}>User Text Area</label>
                    <input type="text" className="sg-input" placeholder="Type here to test focus states..." />
                  </div>
                )}
                {selectedSnippet === 'modal' && (
                  <div className="sg-preview-modal-shell">
                    <div className="sg-preview-modal-header">
                      <h5>Support Modal Overlay</h5>
                    </div>
                    <p>Floating overlay window with escape key hooks.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="snippet-code-column">
              <div className="snippet-header-copy">
                <h4>Code Implementation</h4>
                <div className="snippet-copy-buttons">
                  <button className="copy-code-btn" onClick={() => copyToClipboard(codeSnippets[selectedSnippet].jsx, 'JSX Code')}>
                    Copy JSX
                  </button>
                  <button className="copy-code-btn" onClick={() => copyToClipboard(codeSnippets[selectedSnippet].css, 'CSS Code')}>
                    Copy CSS
                  </button>
                </div>
              </div>
              <pre className="sg-code">
                <code>{codeSnippets[selectedSnippet].jsx}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 6. ICONS DIRECTORY */}
        <section className="sg-section">
          <h2>
            <span className="material-symbols-outlined">grid_view</span> 
            Material Symbols Directory
          </h2>
          <p>Commonly rendered functional symbols. Hover over any box to identify the exact string token required for the Material Symbol tag.</p>
          
          <div className="icons-grid">
            {iconsList.map((icon, index) => (
              <div key={index} className="sg-icon" onClick={() => copyToClipboard(icon, `Icon "${icon}"`)}>
                <span className="material-symbols-outlined">{icon}</span>
                <span>{icon}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 7. ACCESSIBILITY RULES */}
        <section className="sg-section">
          <h2>
            <span className="material-symbols-outlined">accessibility_new</span> 
            Accessibility Conformance (WCAG 2.1 AA)
          </h2>
          <p>To support all students, PsyMind.AI builds accessibility parameters directly into the compilation layers:</p>
          
          <ul className="sg-list">
            <li>
              <strong>Keyboard Navigation:</strong> All inputs, selection lists, and action links are Tab-navigable. Interactive cards and list items display distinct high-contrast outlines when focused.
            </li>
            <li>
              <strong>Focus Locking:</strong> Overlay modals trap keyboard tab focus, preventing off-screen indexing while the modal is open.
            </li>
            <li>
              <strong>Reduced Motion Rules:</strong> Transition times are disabled (`0ms`) and scaling vectors are bypassed when `prefers-reduced-motion` is active.
            </li>
            <li>
              <strong>Dyslexic Typography:</strong> Accessible layout parameters permit substituting standardized font structures dynamically based on client config settings.
            </li>
          </ul>
        </section>

      </main>

      <Footer />
      <ScrollToTopButton />
    </m.div>
  )
}

export default StyleGuidePage
