/**
 * Navigation Debug Script
 * Run this in browser console to diagnose routing issues
 * 
 * Usage: Copy and paste this entire script into browser console
 */

(function() {
  console.clear();
  console.log('%c🔍 Navigation Debug Tool Started', 'background: #6366f1; color: white; padding: 8px; font-weight: bold;');
  console.log('');

  // 1. Check for duplicate main elements
  const mainElements = document.querySelectorAll('main');
  console.log(`%c1. Main Elements Check`, 'font-weight: bold; font-size: 14px;');
  console.log(`   Found ${mainElements.length} <main> element(s)`);
  if (mainElements.length > 1) {
    console.error('   ❌ ISSUE: Multiple <main> elements detected!');
    mainElements.forEach((main, i) => {
      console.log(`   Main ${i + 1}:`, {
        id: main.id,
        className: main.className,
        element: main
      });
    });
  } else if (mainElements.length === 1) {
    console.log('   ✅ Only one <main> element (correct)');
  } else {
    console.warn('   ⚠️ No <main> elements found');
  }
  console.log('');

  // 2. Check view transition names
  console.log(`%c2. View Transition Names`, 'font-weight: bold; font-size: 14px;');
  const elementsWithViewTransition = document.querySelectorAll('[style*="view-transition-name"]');
  const computedTransitions = [];
  document.querySelectorAll('*').forEach(el => {
    const computed = window.getComputedStyle(el).viewTransitionName;
    if (computed && computed !== 'none') {
      computedTransitions.push({
        element: el,
        name: computed,
        tag: el.tagName
      });
    }
  });
  
  console.log(`   Found ${computedTransitions.length} elements with view-transition-name`);
  const duplicates = {};
  computedTransitions.forEach(item => {
    if (!duplicates[item.name]) {
      duplicates[item.name] = [];
    }
    duplicates[item.name].push(item);
  });
  
  Object.entries(duplicates).forEach(([name, items]) => {
    if (items.length > 1) {
      console.error(`   ❌ DUPLICATE: "${name}" used by ${items.length} elements:`, items);
    } else {
      console.log(`   ✅ "${name}" - unique`);
    }
  });
  console.log('');

  // 3. Check Next.js router
  console.log(`%c3. Next.js Router Check`, 'font-weight: bold; font-size: 14px;');
  console.log('   Current pathname:', window.location.pathname);
  console.log('   Current URL:', window.location.href);
  console.log('');

  // 4. Check for Link components
  console.log(`%c4. Link Components Check`, 'font-weight: bold; font-size: 14px;');
  const links = document.querySelectorAll('a[href]');
  console.log(`   Found ${links.length} total <a> elements`);
  
  const internalLinks = Array.from(links).filter(link => {
    const href = link.getAttribute('href');
    return href && href.startsWith('/') && !href.startsWith('//');
  });
  console.log(`   Found ${internalLinks.length} internal links`);
  
  if (internalLinks.length > 0) {
    console.log('   Sample internal links:', internalLinks.slice(0, 5).map(l => ({
      href: l.getAttribute('href'),
      text: l.textContent.trim().substring(0, 30)
    })));
  }
  console.log('');

  // 5. Test navigation
  console.log(`%c5. Testing Navigation`, 'font-weight: bold; font-size: 14px;');
  console.log('   Testing click on first internal link...');
  
  if (internalLinks.length > 0) {
    const testLink = internalLinks[0];
    console.log('   Target:', testLink.getAttribute('href'));
    console.log('   Text:', testLink.textContent.trim());
    
    // Monitor for navigation
    let navigationHappened = false;
    const originalPathname = window.location.pathname;
    
    setTimeout(() => {
      if (window.location.pathname !== originalPathname) {
        console.log('   ✅ Navigation successful!');
        navigationHappened = true;
      } else {
        console.error('   ❌ Navigation did not occur');
      }
    }, 1000);
    
    console.log('   Simulating click...');
    testLink.click();
  } else {
    console.warn('   ⚠️ No internal links found to test');
  }
  console.log('');

  // 6. Check for console errors
  console.log(`%c6. Listening for Errors`, 'font-weight: bold; font-size: 14px;');
  console.log('   Watching for navigation-related errors...');
  
  window.addEventListener('error', (e) => {
    console.error('   ❌ Error caught:', e.message);
  });
  
  window.addEventListener('unhandledrejection', (e) => {
    console.error('   ❌ Unhandled rejection:', e.reason);
  });
  
  // 7. Monitor navigation events
  console.log('');
  console.log(`%c7. Monitoring Navigation Events`, 'font-weight: bold; font-size: 14px;');
  
  let clickCount = 0;
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (link) {
      clickCount++;
      console.log(`   [Click ${clickCount}] Link clicked:`, {
        href: link.getAttribute('href'),
        text: link.textContent.trim().substring(0, 50),
        defaultPrevented: e.defaultPrevented,
        target: e.target.tagName
      });
    }
  }, true);
  
  console.log('   ✅ Click listener active');
  console.log('');
  
  // 8. Check if router.push is working
  console.log(`%c8. Router Test`, 'font-weight: bold; font-size: 14px;');
  console.log('   You can manually test navigation with:');
  console.log('   window.__testNav = (path) => { window.location.href = path; }');
  console.log('   Try: __testNav("/pricing")');
  console.log('');
  
  window.__testNav = (path) => {
    console.log(`   Testing navigation to: ${path}`);
    window.location.href = path;
  };
  
  // Final summary
  console.log('%c✅ Debug script loaded!', 'background: #22c55e; color: white; padding: 8px; font-weight: bold;');
  console.log('Click any link and watch the console output above.');
  console.log('');
})();

