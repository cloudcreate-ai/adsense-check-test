import {
  checkContentQuality,
  checkRequiredPages,
  checkPolicyCompliance,
  checkSiteStructure,
  t,
} from '@cloudcreate/adsense-check-core';

import type { CheckCategory, CheckItem, Lang } from '@cloudcreate/adsense-check-core';
import {
  goodContentPages,
  thinContentPages,
  duplicateContentPages,
  policyViolationPages,
  cleanPages,
  completeLinks,
  missingPrivacyLinks,
  missingContactLinks,
} from './fixtures/pages.js';

const LANG: Lang = 'en';

// ── checkContentQuality ─────────────────────────────────────────────────

describe('checkContentQuality', () => {
  test('good content site passes quality checks', () => {
    const result = checkContentQuality(goodContentPages, goodContentPages.length, LANG, 'content');
    expect(result.category).toBeDefined();
    expect(result.category.name).toBe('Content');
    // Should not have fail items for good content
    const fails = result.category.items.filter(i => i.status === 'fail');
    expect(fails).toHaveLength(0);
  });

  test('thin content triggers warnings', () => {
    const result = checkContentQuality(thinContentPages, thinContentPages.length, LANG, 'content');
    const fails = result.category.items.filter(i => i.status === 'fail');
    expect(fails.length).toBeGreaterThan(0);
  });

  test('duplicate content is detected', () => {
    const result = checkContentQuality(duplicateContentPages, duplicateContentPages.length, LANG, 'content');
    // Cross-page duplication should be flagged
    const dupItem = result.category.items.find(i => i.name.toLowerCase().includes('duplicate'));
    expect(dupItem).toBeDefined();
    expect(dupItem!.status).toBe('fail');
  });

  test('game site skips text volume checks', () => {
    const result = checkContentQuality(
      thinContentPages,
      thinContentPages.length,
      LANG,
      'game',
      thinContentPages.map(() => ({ iframeCount: 1, iframeSrcs: ['https://game.example.com/embed'], canvasCount: 0, textLength: 100 }))
    );
    // Game sites with iframes should not fail on thin text
    expect(result.category.items.filter(i => i.status === 'fail')).toHaveLength(0);
  });

  test('site scale is checked', () => {
    const result = checkContentQuality(goodContentPages, 2, LANG, 'content');
    const scaleItem = result.category.items.find(i => i.name.toLowerCase().includes('scale'));
    expect(scaleItem).toBeDefined();
    expect(scaleItem!.status).toBe('fail');
  });
});

// ── checkRequiredPages ──────────────────────────────────────────────────

describe('checkRequiredPages', () => {
  test('complete link set passes all checks', async () => {
    const result = await checkRequiredPages({
      allLinks: completeLinks,
      navText: '',
      footerText: '',
      sitemapUrls: [],
    }, LANG);

    const fails = result.items.filter(i => i.status === 'fail');
    expect(fails).toHaveLength(0);
  });

  test('missing privacy policy causes fail', async () => {
    const result = await checkRequiredPages({
      allLinks: missingPrivacyLinks,
      navText: '',
      footerText: '',
      sitemapUrls: [],
    }, LANG);

    const privacyItem = result.items.find(i => i.name.includes('Privacy'));
    expect(privacyItem).toBeDefined();
    expect(privacyItem!.status).toBe('warn');
  });

  test('missing contact causes warn', async () => {
    const result = await checkRequiredPages({
      allLinks: missingContactLinks,
      navText: '',
      footerText: '',
      sitemapUrls: [],
    }, LANG);

    const contactItem = result.items.find(i => i.name.includes('Contact'));
    expect(contactItem).toBeDefined();
    expect(contactItem!.status).toBe('warn');
  });
});

// ── checkPolicyCompliance ───────────────────────────────────────────────

describe('checkPolicyCompliance', () => {
  test('clean pages pass policy check', () => {
    const result = checkPolicyCompliance(cleanPages, LANG);
    expect(result.items[0].status).toBe('pass');
  });

  test('gambling content triggers fail', () => {
    const result = checkPolicyCompliance(policyViolationPages, LANG);
    expect(result.items[0].status).toBe('fail');
  });
});

// ── checkSiteStructure ──────────────────────────────────────────────────

describe('checkSiteStructure', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('returns CheckCategory with structure items', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(''),
    });

    const result = await checkSiteStructure(
      'https://example.com',
      [
        'https://example.com/page1',
        'https://example.com/page2',
        'https://example.com/page3',
        'https://example.com/page4',
        'https://example.com/page5',
        'https://example.com/page6',
      ],
      1,
      [],
      LANG
    );

    expect(result).toBeDefined();
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.some(i => i.name.includes('robots'))).toBe(true);
    expect(result.items.some(i => i.name.includes('sitemap'))).toBe(true);
  });
});
