// Material Icons Protection - Testing Guide
// Run these tests to verify the implementation

/**
 * TEST 1: Font Loading Detection
 * Verify that the component detects when Material Symbols font is loaded
 */
export function testFontLoading() {
  console.log('TEST 1: Font Loading Detection');
  
  if (typeof document !== 'undefined' && document.fonts) {
    const isFontLoaded = document.fonts.check('24px "Material Symbols Outlined"');
    console.log('Material Symbols Outlined loaded:', isFontLoaded);
    
    document.fonts.ready.then(() => {
      console.log('✓ All fonts ready');
    }).catch(() => {
      console.log('⚠ Font loading failed - fallback active');
    });
  }
}

/**
 * TEST 2: Translation Blocking
 * Verify that translate="no" is applied correctly
 */
export function testTranslationBlocking() {
  console.log('TEST 2: Translation Blocking');
  
  const icons = document.querySelectorAll('.material-symbols-outlined');
  let translationBlockedCount = 0;
  
  icons.forEach((icon) => {
    const hasTranslateNo = icon.getAttribute('translate') === 'no';
    if (hasTranslateNo) {
      translationBlockedCount++;
    }
  });
  
  console.log(`✓ ${translationBlockedCount}/${icons.length} icons have translate="no"`);
  
  // Check HTML root
  const htmlElement = document.documentElement;
  const htmlHasTranslateNo = htmlElement.getAttribute('translate') === 'no';
  console.log(`✓ HTML root has translate="no": ${htmlHasTranslateNo}`);
}

/**
 * TEST 3: Fallback Styling
 * Verify that fallback styles are applied when font fails
 */
export function testFallbackStyling() {
  console.log('TEST 3: Fallback Styling');
  
  const icons = document.querySelectorAll('.material-symbols-outlined');
  
  icons.forEach((icon) => {
    const computedStyle = window.getComputedStyle(icon);
    const hasLigatures = computedStyle.fontFeatureSettings.includes('liga');
    const hasTranslateNone = computedStyle.translate === 'none';
    
    console.log(`Icon "${icon.textContent}":`, {
      ligatures: hasLigatures,
      translateNone: hasTranslateNone,
      display: computedStyle.display,
    });
  });
}

/**
 * TEST 4: Accessibility
 * Verify that aria-labels are present for non-decorative icons
 */
export function testAccessibility() {
  console.log('TEST 4: Accessibility');
  
  const icons = document.querySelectorAll('.material-symbols-outlined');
  let accessibleCount = 0;
  let decorativeCount = 0;
  
  icons.forEach((icon) => {
    const isDecorative = icon.getAttribute('aria-hidden') === 'true';
    const hasLabel = icon.getAttribute('aria-label') !== null;
    
    if (isDecorative) {
      decorativeCount++;
    } else if (hasLabel) {
      accessibleCount++;
      console.log(`✓ Accessible icon: "${icon.getAttribute('aria-label')}"`);
    } else {
      console.warn(`⚠ Non-decorative icon without aria-label: "${icon.textContent}"`);
    }
  });
  
  console.log(`Summary: ${accessibleCount} accessible, ${decorativeCount} decorative`);
}

/**
 * TEST 5: Font Display Strategy
 * Verify that font-display is set correctly
 */
export function testFontDisplayStrategy() {
  console.log('TEST 5: Font Display Strategy');
  
  const styleSheets = document.styleSheets;
  let materialSymbolsFound = false;
  
  for (let i = 0; i < styleSheets.length; i++) {
    try {
      const rules = styleSheets[i].cssRules || styleSheets[i].rules;
      
      for (let j = 0; j < rules.length; j++) {
        const rule = rules[j];
        
        if ((rule as any).href && (rule as any).href.includes('Material+Symbols')) {
          console.log('✓ Material Symbols font found');
          console.log('  URL:', (rule as any).href);
          
          if ((rule as any).href.includes('display=block')) {
            console.log('  ✓ Using font-display: block');
            materialSymbolsFound = true;
          } else if ((rule as any).href.includes('display=swap')) {
            console.warn('  ⚠ Using font-display: swap (should be block for icons)');
          }
        }
      }
    } catch (e) {
      // CORS restrictions - expected for external stylesheets
    }
  }
  
  if (!materialSymbolsFound) {
    console.log('ℹ Material Symbols font loaded via external stylesheet (CORS protected)');
  }
}

/**
 * TEST 6: Layout Stability
 * Verify that icons don't cause layout shift
 */
export function testLayoutStability() {
  console.log('TEST 6: Layout Stability');
  
  const icons = document.querySelectorAll('.material-symbols-outlined');
  
  icons.forEach((icon) => {
    const rect = icon.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(icon);
    
    console.log(`Icon "${icon.textContent}":`, {
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      display: computedStyle.display,
      position: computedStyle.position,
    });
  });
}

/**
 * TEST 7: Simulate Font Failure
 * Manually test fallback behavior
 */
export function testFontFailure() {
  console.log('TEST 7: Simulating Font Failure');
  
  const icons = document.querySelectorAll('.material-symbols-outlined');
  
  icons.forEach((icon) => {
    // Simulate font failure by setting transparent color
    (icon as HTMLElement).style.color = 'transparent';
    (icon as HTMLElement).style.fontSize = '0';
    
    console.log(`✓ Applied fallback styling to: "${icon.textContent}"`);
  });
  
  console.log('⚠ This is a simulation. Refresh to restore normal state.');
}

/**
 * TEST 8: Performance Metrics
 * Check font loading performance
 */
export function testPerformanceMetrics() {
  console.log('TEST 8: Performance Metrics');
  
  if (typeof PerformanceObserver !== 'undefined') {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes('Material')) {
          console.log(`Font: ${entry.name}`);
          console.log(`  Duration: ${entry.duration.toFixed(2)}ms`);
          console.log(`  Start: ${entry.startTime.toFixed(2)}ms`);
        }
      }
    });
    
    observer.observe({ entryTypes: ['resource'] });
  }
  
  // Check LCP (Largest Contentful Paint)
  if (typeof PerformanceObserver !== 'undefined') {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log(`LCP: ${(lastEntry as any).renderTime || (lastEntry as any).loadTime}ms`);
    });
    
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  }
}

/**
 * RUN ALL TESTS
 */
export function runAllTests() {
  console.log('🧪 Running Material Icons Protection Tests\n');
  
  testFontLoading();
  console.log('');
  
  testTranslationBlocking();
  console.log('');
  
  testFallbackStyling();
  console.log('');
  
  testAccessibility();
  console.log('');
  
  testFontDisplayStrategy();
  console.log('');
  
  testLayoutStability();
  console.log('');
  
  testPerformanceMetrics();
  console.log('');
  
  console.log('✅ All tests completed. Check console for results.');
}


