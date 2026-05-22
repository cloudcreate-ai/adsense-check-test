import { checkSiteBasic, checkHomeQuality, check } from '@cloudcreate/adsense-check-core';

import type { CheckReport, Lang } from '@cloudcreate/adsense-check-core';

const LANG: Lang = 'en';
const TEST_URL = process.env.TEST_SITE_URL || 'https://example.com';
const SKIP = process.env.SKIP_INTEGRATION === '1';

describe('library integration tests', () => {
  test('checkSiteBasic returns valid report structure', { timeout: 60000 }, async () => {
    if (SKIP) return;

    const report = await checkSiteBasic(TEST_URL, 10000, LANG);

    expect(report).toBeDefined();
    expect(report.url).toBe(TEST_URL);
    expect(report.timestamp).toBeDefined();
    expect(report.siteType).toBeDefined();
    expect(report.categories).toBeDefined();
    expect(Array.isArray(report.categories)).toBe(true);
    expect(report.categories.length).toBeGreaterThan(0);
    expect(report.hardStatus).toMatch(/^(ready|warn|fail)$/);
    expect(typeof report.compositeScore).toBe('number');

    // Each category should have valid items
    for (const cat of report.categories) {
      expect(cat.name).toBeDefined();
      expect(cat.items).toBeDefined();
      for (const item of cat.items) {
        expect(item.name).toBeDefined();
        expect(item.status).toMatch(/^(pass|warn|fail|skip)$/);
        expect(item.message).toBeDefined();
      }
    }
  });

  test('checkHomeQuality returns valid report structure', { timeout: 60000 }, async () => {
    if (SKIP) return;

    const report = await checkHomeQuality(TEST_URL, 10000, LANG);

    expect(report).toBeDefined();
    expect(report.url).toBe(TEST_URL);
    expect(typeof report.homeQuality).toBe('number');
    expect(report.homeQuality).toBeGreaterThanOrEqual(0);
    expect(report.homeQuality).toBeLessThanOrEqual(100);
  });

  test('check with --no-ai returns full non-AI report', { timeout: 120000 }, async () => {
    if (SKIP) return;

    const report = await check({
      url: TEST_URL,
      skipAi: true,
      timeout: 10000,
      lang: LANG,
      maxCrawl: 5,
    });

    expect(report).toBeDefined();
    expect(report.url).toBe(TEST_URL);
    expect(report.siteType).toBeDefined();
    expect(report.categories.length).toBeGreaterThan(0);

    // AI score should be 0 when skipped
    expect(report.siteAiScore).toBe(0);

    // Hard status should be computable without AI
    expect(report.hardStatus).toMatch(/^(ready|warn|fail)$/);

    // Composite score should be computable
    expect(typeof report.compositeScore).toBe('number');
  });

  test('CheckReport type invariants', () => {
    // Validate the report shape matches our TypeScript interfaces
    const report: Partial<CheckReport> = {
      url: 'https://example.com',
      timestamp: new Date().toISOString(),
      lang: 'en',
      siteType: 'content',
      siteTypeConfidence: 'high',
      categories: [],
      hardCategories: [],
      softCategories: [],
      score: 0,
      totalChecks: 0,
      passed: 0,
      warned: 0,
      failed: 0,
      skipped: 0,
      pages: [],
      compositeScore: 0,
      categoryScores: [],
      hardStatus: 'ready',
      softScore: 0,
      warningRatio: 0,
      warningPenalty: 0,
      siteAiScore: 0,
      pageValueScore: 0,
      pageValueEstimated: true,
      siteQuality: 0,
      homeQuality: 0,
    };

    expect(report.url).toMatch(/^https?:\/\//);
    expect(report.lang).toMatch(/^(en|zh)$/);
    expect(report.siteType).toMatch(/^(content|tool|game|video|reference|unsupported)$/);
    expect(report.siteTypeConfidence).toMatch(/^(high|medium|low)$/);
    expect(report.hardStatus).toMatch(/^(ready|warn|fail)$/);
  });
});
