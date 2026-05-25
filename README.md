# @cloudcreate/adsense-check-test

Test suite for the adsense-check monorepo. Validates core library behavior, CLI functionality, and cross-module compatibility through unit and integration tests.

## Purpose

This package simulates real-user scenarios to verify that `@cloudcreate/adsense-check-core` and `@cloudcreate/adsense-check` (CLI) work correctly in production-like environments. It tests against the published npm packages, not source code — the same experience an end user would have after `npm install`.

## Test Categories

### Library Integration (`library.test.ts`)

Tests the core library's public API by calling `check()`, `checkSiteBasic()`, and `checkHomeQuality()` against real websites. Validates:

- Report structure matches TypeScript interfaces
- Score values are within expected ranges
- Hard status values are valid
- Category items have correct shapes

### CLI Smoke Tests (`cli.test.ts`)

Spawns child processes running `npx adsense-check` to verify:

- `--help` shows all subcommands
- Invalid URLs exit with errors
- `site`, `home`, `topic` subcommands return valid JSON
- Output format is correct

### Core Unit Tests (`checks.test.ts`, `scorer.test.ts`)

Unit tests for scoring algorithms and check logic:

- 5-dimension AI page scoring (`computePageAiScore`)
- Composite score calculation (`computeCompositeScore`)
- Site-level scoring (`computeSiteAiScore`)
- Individual check rule behavior

## Quick Start

```bash
npm install
npm run test            # Run all tests
npm run test:watch      # Watch mode
npm run typecheck       # Type check only
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `TEST_SITE_URL` | `https://example.com` | Target URL for integration tests |
| `SKIP_INTEGRATION` | - | Set to `1` to skip integration tests (CI, offline) |

```bash
# Skip integration tests (unit only)
SKIP_INTEGRATION=1 npm run test

# Test against a different site
TEST_SITE_URL=https://yoursite.com npm run test
```

## Dependencies

- `@cloudcreate/adsense-check-core` — tested library
- `vitest` — test runner (globals enabled)

## License

MIT

## Links

- Homepage: https://cloudcreate.ai
- Issues: https://github.com/cloudcreate-ai/adsense-check-test/issues
- Contact: contact@cloudcreate.ai
