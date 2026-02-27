const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 } // iPhone 16 Pro Max
  });
  const page = await context.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  
  page.on('pageerror', err => errors.push(err.message));
  
  console.log('Loading page...');
  await page.goto('http://localhost:8888/index.html');
  await page.waitForTimeout(2000);
  
  // Check elements
  const startBtn = await page.$('#start-btn');
  const canvas = await page.$('#game-canvas');
  const score = await page.$('#score');
  const level = await page.$('#level');
  const lines = await page.$('#lines');
  
  console.log('Start button:', startBtn ? '✓' : '✗');
  console.log('Canvas:', canvas ? '✓' : '✗');
  console.log('Score:', score ? '✓' : '✗');
  console.log('Level:', level ? '✓' : '✗');
  console.log('Lines:', lines ? '✓' : '✗');
  
  // Click start
  if (startBtn) {
    await startBtn.click();
    console.log('Clicked start button');
    await page.waitForTimeout(1000);
  }
  
  // Check if game is running
  const scoreText = await score?.textContent();
  console.log('Score after start:', scoreText);
  
  // Console errors
  console.log('Console errors:', errors.length > 0 ? errors.join(', ') : 'None');
  
  await browser.close();
  
  if (errors.length > 0) {
    console.log('\n❌ Test FAILED');
    process.exit(1);
  } else {
    console.log('\n✅ Test PASSED');
  }
})();
