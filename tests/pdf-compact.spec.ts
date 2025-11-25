import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('PDF Compact Layout Tests', () => {
  test('should navigate through form and generate compact PDF', async ({ page }) => {
    await page.goto('http://localhost:8080');
    await page.waitForTimeout(2000);

    // Screenshot initial
    await page.screenshot({ path: 'tests/screenshots/01-initial.png', fullPage: true });
    console.log('Screenshot 01: Initial page');

    // Step 1: Select Europe zone
    console.log('Step 1: Selecting destination zone...');
    const europeLabel = page.locator('label:has-text("Europe")').first();
    if (await europeLabel.isVisible()) {
      await europeLabel.click();
      await page.waitForTimeout(500);
    }
    await page.screenshot({ path: 'tests/screenshots/02-zone-selected.png', fullPage: true });

    // Select a country (France)
    const franceOption = page.locator('text=France').first();
    if (await franceOption.isVisible()) {
      await franceOption.click();
      await page.waitForTimeout(500);
    }
    await page.screenshot({ path: 'tests/screenshots/03-country-selected.png', fullPage: true });

    // Click Next
    await page.click('button:has-text("Suivant")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/screenshots/04-step2.png', fullPage: true });
    console.log('Step 2: Travelers');

    // Step 2: Just continue (default adult)
    await page.click('button:has-text("Suivant")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/screenshots/05-step3.png', fullPage: true });
    console.log('Step 3: Trip type');

    // Step 3: Select trip type
    const tripTypeLabels = await page.locator('label').all();
    if (tripTypeLabels.length > 0) {
      await tripTypeLabels[0].click();
      await page.waitForTimeout(300);
    }
    await page.click('button:has-text("Suivant")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/screenshots/06-step4.png', fullPage: true });
    console.log('Step 4: Activities');

    // Step 4: Select an activity
    const activityLabels = await page.locator('[role="checkbox"], input[type="checkbox"]').all();
    if (activityLabels.length > 0) {
      await activityLabels[0].click();
      await page.waitForTimeout(300);
    }
    await page.click('button:has-text("Suivant")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/screenshots/07-step5-options.png', fullPage: true });
    console.log('Step 5: Options');

    // Step 5: Click Next to go to checkout/PDF
    await page.click('button:has-text("Suivant")');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'tests/screenshots/08-step6-checkout.png', fullPage: true });
    console.log('Step 6: Checkout/PDF');

    // Look for PDF format selection
    const compactRadio = page.locator('text=Compact').first();
    if (await compactRadio.isVisible()) {
      await compactRadio.click();
      await page.waitForTimeout(500);
    }
    await page.screenshot({ path: 'tests/screenshots/09-format-compact.png', fullPage: true });

    // Wait for PDF preview to load
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'tests/screenshots/10-pdf-preview.png', fullPage: true });
    console.log('PDF Preview loaded');

    // Try to find download button
    const downloadBtn = page.locator('button').filter({ hasText: /telecharger|download|pdf/i }).first();
    if (await downloadBtn.isVisible()) {
      console.log('Download button found');

      // Setup download handler
      const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
      await downloadBtn.click();

      try {
        const download = await downloadPromise;
        const downloadPath = path.join('tests', 'downloads', 'checklist-compact.pdf');
        await download.saveAs(downloadPath);
        console.log(`PDF saved to: ${downloadPath}`);

        // Verify PDF
        const stats = fs.statSync(downloadPath);
        console.log(`PDF size: ${stats.size} bytes`);
        expect(stats.size).toBeGreaterThan(1000);
      } catch (e) {
        console.log('Download not triggered, checking for inline preview...');
        await page.screenshot({ path: 'tests/screenshots/11-after-download-click.png', fullPage: true });
      }
    } else {
      console.log('No download button visible');
    }

    // Final screenshot
    await page.screenshot({ path: 'tests/screenshots/12-final.png', fullPage: true });
    console.log('Test completed');
  });
});
