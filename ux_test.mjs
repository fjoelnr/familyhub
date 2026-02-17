import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
    console.log('Starting Refined UX Test Script...');
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Ensure directory exists
    if (!fs.existsSync('ux_test_artifacts')) {
        fs.mkdirSync('ux_test_artifacts');
    }

    const report = [];

    try {
        console.log('Navigating to dashboard...');
        await page.goto('http://localhost:3000');
        await page.waitForTimeout(3000);

        // 1. Ignore Scenario
        report.push("Scenario 1: Ignore - Executed");
        await page.screenshot({ path: 'ux_test_artifacts/1_dashboard_initial.png', fullPage: true });

        // Check for specific cards
        const card1 = page.locator('text="Should we prepare?"');
        const card2 = page.locator('text="Want to group these?"');

        const count1 = await card1.count();
        const count2 = await card2.count();

        if (count1 === 0 && count2 === 0) {
            console.error('No prompts found!');
            // Dump source to debug
            fs.writeFileSync('ux_test_artifacts/page_dump.html', await page.content());
        } else {
            console.log(`Found prompts: "Should we prepare?" (${count1}), "Want to group these?" (${count2})`);
        }

        // 2. Curious Click Scenario
        const targetPrompt = count1 > 0 ? card1.first() : card2.first();
        if (await targetPrompt.isVisible()) {
            console.log('Clicking prompt...');
            await targetPrompt.click();
            await page.waitForTimeout(1000); // Transition
            await page.screenshot({ path: 'ux_test_artifacts/2_chat_transition.png' });

            // Verify Silence: Check if a new message appeared automatically?
            // We assume last message is the "User" prompt or system silence? 
            // Actually, clicking prompt usually sends the prompt as user message? Or system asks question?
            // mockContext says: "question": "I noticed this week is busier..."
            // So system SHOULD speak? 
            // Wait, goal is "Does silence feel acceptable?". 
            // Iteration 3 goal: "System may open a door...". 
            // If I click prompt "Should we prepare?", the system *should* ask the question.
            // THEN it should be silent waiting for me.

            await page.waitForTimeout(3000);
            await page.screenshot({ path: 'ux_test_artifacts/3_chat_state_wait.png' });
            console.log('Waited 3s. Silence check complete.');
        }

        // 3. Decline Scenario
        // Find input
        const input = page.locator('input').first(); // Adjust if multiple inputs
        if (await input.isVisible()) {
            console.log('Input found. Typing "No"...');
            await input.fill('No, thanks.');
            await input.press('Enter');
            await page.waitForTimeout(2000);
            console.log('Capturing Decline Response...');
            await page.screenshot({ path: 'ux_test_artifacts/4_decline_response.png' });

            // Check for "Pushback" - look for text indicating insistence
            const content = await page.content();
            if (content.includes("Are you sure") || content.includes("Please reconsider")) {
                console.log('WARNING: Potential pushback detected.');
            } else {
                console.log('Reaction seems neutral.');
            }
        } else {
            console.error('Input NOT found! Selectors: input');
        }

        // 4. Positive Engagement
        console.log('Reloading...');
        await page.reload();
        await page.waitForTimeout(3000);

        // Try to find the OTHER prompt if possible, or just re-use mechanism
        const promptReuse = page.locator('text="Want to group these?"').first();
        if (await promptReuse.isVisible()) {
            await promptReuse.click();
            await page.waitForTimeout(1000);
            if (await input.isVisible()) {
                await input.fill('Yes, please.');
                await input.press('Enter');
                await page.waitForTimeout(2000);
                await page.screenshot({ path: 'ux_test_artifacts/5_positive_response.png' });
            }
        } else if (await card1.isVisible()) {
            // Fallback to first card again if second not found
            console.log('Second prompt not found, reusing first for positive test');
            await card1.click();
            await page.waitForTimeout(1000);
            if (await input.isVisible()) {
                await input.fill('Yes, please.');
                await input.press('Enter');
                await page.waitForTimeout(2000);
                await page.screenshot({ path: 'ux_test_artifacts/5_positive_response.png' });
            }
        }

        // 5. Repetition Check
        await page.reload();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'ux_test_artifacts/6_repetition_check.png', fullPage: true });

    } catch (e) {
        console.error('Test Error:', e);
    } finally {
        await browser.close();
        console.log('Test Complete.');
    }
})();
