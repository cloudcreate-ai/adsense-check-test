import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

const exec = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));

// Resolve CLI binary path — works whether called from test dir or workspace root
function resolveCliPath(): string {
  // Try workspace-relative first (parent/parent)
  const workspacePath = join(__dirname, '..', '..', 'adsense-check-cli', 'dist', 'cli.js');
  try {
    readFileSync(workspacePath);
    return workspacePath;
  } catch { /* not found, try node_modules */ }

  // Try node_modules (resolved via core package)
  const nodeModulesPath = join(__dirname, '..', 'node_modules', '@cloudcreate', 'adsense-check-cli', 'dist', 'cli.js');
  try {
    readFileSync(nodeModulesPath);
    return nodeModulesPath;
  } catch { /* fallback to PATH */ }

  return 'adsense-check';
}

const CLI_PATH = resolveCliPath();
const TEST_URL = 'https://example.com';

describe('CLI smoke tests', () => {
  test('--help shows all subcommands', async () => {
    const { stdout } = await exec('node', [CLI_PATH, '--help'], { timeout: 10000 });
    expect(stdout).toContain('page');
    expect(stdout).toContain('topic');
    expect(stdout).toContain('eval');
    expect(stdout).toContain('site');
    expect(stdout).toContain('home');
    expect(stdout).toContain('init');
  });

  test('invalid URL exits with error', async () => {
    try {
      await exec('node', [CLI_PATH, 'not-a-valid-url'], { timeout: 10000 });
      expect.fail('Should have thrown');
    } catch (err: unknown) {
      const e = err as { code?: number; stderr?: string };
      expect(e.code).not.toBe(0);
      expect(e.stderr || '').toContain('Invalid URL');
    }
  });

  test('site subcommand returns JSON', async () => {
      const { stdout } = await exec('node', [CLI_PATH, 'site', TEST_URL, '--json', '--timeout', '10000'], {
        timeout: 60000,
      });
      const report = JSON.parse(stdout);
      expect(report.url).toBe(TEST_URL);
      expect(report.categories).toBeDefined();
      expect(Array.isArray(report.categories)).toBe(true);
      expect(report.hardStatus).toMatch(/^(ready|warn|fail)$/);
    });

  test('home subcommand returns JSON', async () => {
      const { stdout } = await exec('node', [CLI_PATH, 'home', TEST_URL, '--json', '--timeout', '10000'], {
        timeout: 60000,
      });
      const report = JSON.parse(stdout);
      expect(report.url).toBe(TEST_URL);
      expect(report.homeQuality).toBeDefined();
      expect(typeof report.homeQuality).toBe('number');
    });

  test('topic subcommand returns type and topic', { timeout: 60000 }, async () => {
      const { stdout } = await exec('node', [CLI_PATH, 'topic', TEST_URL, '--json', '--timeout', '10000'], {
        timeout: 60000,
      });
      const result = JSON.parse(stdout);
      expect(result.domType).toBeDefined();
      expect(result.topic).toBeDefined();
      expect(result.confidence).toBeDefined();
    });
});
