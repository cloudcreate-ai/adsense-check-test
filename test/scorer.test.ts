import {
  computePageAiScore,
  computeSiteAiScore,
  computeCompositeScore,
  scorePage,
  scoreCategory,
} from '@cloudcreate/adsense-check-core';

import type { PageAiAnalysis } from '@cloudcreate/adsense-check-core';

function makePageAnalysis(overrides: Partial<PageAiAnalysis> = {}): PageAiAnalysis {
  return {
    url: 'https://example.com/page',
    status: 'pass',
    valueScore: 8,
    originalityScore: 7,
    relevanceScore: 9,
    complianceScore: 10,
    translationScore: 8,
    valueReason: 'Good value',
    originalityReason: 'Some original content',
    relevanceReason: 'On topic',
    complianceReason: 'Clean',
    translationReason: 'Well written',
    assessment: 'Good page',
    suggestions: [],
    ...overrides,
  };
}

// ── computePageAiScore ──────────────────────────────────────────────────

describe('computePageAiScore', () => {
  test('perfect scores return 100', () => {
    const analysis = makePageAnalysis({
      valueScore: 10, originalityScore: 10,
      relevanceScore: 10, complianceScore: 10, translationScore: 10,
    });
    expect(computePageAiScore(analysis)).toBe(100);
  });

  test('zero in any dimension returns 0', () => {
    const analysis = makePageAnalysis({ valueScore: 0 });
    expect(computePageAiScore(analysis)).toBe(0);
  });

  test('moderate scores return reasonable value', () => {
    const analysis = makePageAnalysis({
      valueScore: 5, originalityScore: 5,
      relevanceScore: 5, complianceScore: 5, translationScore: 5,
    });
    expect(computePageAiScore(analysis)).toBe(50);
  });
});

// ── computeSiteAiScore ──────────────────────────────────────────────────

describe('computeSiteAiScore', () => {
  test('single page returns its score', () => {
    expect(computeSiteAiScore([
      { pageType: 'content', score: 80 },
    ])).toBe(80);
  });

  test('empty array returns 0', () => {
    expect(computeSiteAiScore([])).toBe(0);
  });

  test('weighted average of multiple pages', () => {
    const scores = computeSiteAiScore([
      { pageType: 'content', score: 90 },
      { pageType: 'content', score: 70 },
    ]);
    expect(scores).toBe(80);
  });

  test('homepage has higher weight', () => {
    const withHomepage = computeSiteAiScore([
      { pageType: 'homepage', score: 100 },
      { pageType: 'content', score: 0 },
    ]);
    const withoutHomepage = computeSiteAiScore([
      { pageType: 'content', score: 100 },
      { pageType: 'content', score: 0 },
    ]);
    expect(withHomepage).toBeGreaterThan(withoutHomepage);
  });
});

// ── computeCompositeScore ───────────────────────────────────────────────

describe('computeCompositeScore', () => {
  test('all pass, good AI scores returns high composite', () => {
    const result = computeCompositeScore(
      [{ pageType: 'content', score: 100 }],
      [],
      [],
      [makePageAnalysis()],
    );

    expect(result.compositeScore).toBeGreaterThan(50);
    expect(result.hardStatus).toBe('ready');
    expect(result.pageValueEstimated).toBe(false);
  });

  test('no AI analysis returns estimated page value', () => {
    const result = computeCompositeScore(
      [{ pageType: 'content', score: 100 }],
      [],
      [],
      undefined,
    );

    expect(result.pageValueEstimated).toBe(true);
  });

  test('compliance fail caps the composite score', () => {
    const result = computeCompositeScore(
      [{ pageType: 'content', score: 100 }],
      [{ name: 'Policy', items: [{ name: 'Keywords', status: 'fail', message: 'Violation found' }], group: 'hard' }],
      [],
      [makePageAnalysis({ complianceScore: 2 })],
    );

    expect(result.compositeScore).toBeLessThanOrEqual(50);
  });

  test('relevance fail caps the composite score', () => {
    const result = computeCompositeScore(
      [{ pageType: 'content', score: 100 }],
      [],
      [],
      [makePageAnalysis({ relevanceScore: 2 })],
    );

    expect(result.compositeScore).toBeLessThanOrEqual(60);
  });
});

// ── scorePage ───────────────────────────────────────────────────────────

describe('scorePage', () => {
  test('AI pass returns score 100', () => {
    const { score } = scorePage('content', 500, 80, [], 'content', 'pass');
    expect(score).toBe(100);
  });

  test('AI warn returns score 70', () => {
    const { score } = scorePage('content', 500, 80, [], 'content', 'warn');
    expect(score).toBe(70);
  });

  test('AI fail returns score 0', () => {
    const { score } = scorePage('content', 500, 80, [], 'content', 'fail');
    expect(score).toBe(0);
  });

  test('no AI status returns score 100 (default)', () => {
    const { score } = scorePage('content', 500, 80, [], 'content');
    expect(score).toBe(100);
  });
});

// ── scoreCategory ───────────────────────────────────────────────────────

describe('scoreCategory', () => {
  test('all pass returns full score', () => {
    const cs = scoreCategory({
      name: 'Test',
      items: [
        { name: 'A', status: 'pass', message: '' },
        { name: 'B', status: 'pass', message: '' },
      ],
    });
    expect(cs.score).toBe(cs.maxScore);
    expect(cs.maxScore).toBe(200);
  });

  test('all fail returns zero', () => {
    const cs = scoreCategory({
      name: 'Test',
      items: [
        { name: 'A', status: 'fail', message: '' },
        { name: 'B', status: 'fail', message: '' },
      ],
    });
    expect(cs.score).toBe(0);
  });

  test('warn returns 40 per item', () => {
    const cs = scoreCategory({
      name: 'Test',
      items: [{ name: 'A', status: 'warn', message: '' }],
    });
    expect(cs.score).toBe(40);
    expect(cs.maxScore).toBe(100);
  });

  test('empty category returns zero', () => {
    const cs = scoreCategory({ name: 'Empty', items: [] });
    expect(cs.score).toBe(0);
    expect(cs.maxScore).toBe(0);
  });
});
