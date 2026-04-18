import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const kib = 1024;

const DEFAULT_BUDGETS = {
  indexJsRaw: 750 * kib,
  indexJsGzip: 180 * kib,
  indexCssRaw: 260 * kib,
  indexCssGzip: 150 * kib,
  packTarball: 350 * kib,
  packUnpacked: 1100 * kib,
};

function readBudget(name, fallback) {
  const value = process.env[name];

  if (!value) return fallback;

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new TypeError(`Invalid numeric value for ${name}: "${value}"`);
  }

  return parsed;
}

function sizeOfFile(path) {
  return statSync(path).size;
}

function gzipSizeOfFile(path) {
  const input = readFileSync(path);

  return gzipSync(input, { level: 9 }).length;
}

function formatBytes(bytes) {
  const kb = bytes / kib;

  return `${kb.toFixed(1)} KiB`;
}

function evaluateBudget({ label, actual, limit }) {
  return {
    label,
    actual,
    limit,
    pass: actual <= limit,
  };
}

function collectFilesRecursively(path) {
  const stats = statSync(path);
  if (stats.isFile()) return [path];
  if (!stats.isDirectory()) return [];

  const entries = readdirSync(path, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    files.push(...collectFilesRecursively(resolve(path, entry.name)));
  }

  return files;
}

function readPackageStats() {
  const packageJsonPath = resolve('package.json');
  const packageJsonRaw = readFileSync(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(packageJsonRaw);
  const publishEntries = new Set(['package.json', ...(packageJson.files ?? [])]);
  const files = [];

  for (const entry of publishEntries) {
    const absolute = resolve(entry);
    if (!existsSync(absolute)) continue;
    files.push(...collectFilesRecursively(absolute));
  }

  const relativeFiles = files
    .map((file) => file.replace(`${process.cwd()}/`, ''))
    .sort((a, b) => a.localeCompare(b));

  const unpackedSize = files.reduce((total, file) => total + statSync(file).size, 0);
  const tarballPath = resolve(
    tmpdir(),
    `hoam-design-system-budget-${process.pid}-${Date.now().toString(36)}.tgz`
  );

  const tarResult = spawnSync('tar', ['-czf', tarballPath, ...relativeFiles], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });

  if (tarResult.status !== 0) {
    const errorOutput = tarResult.stderr?.trim() || tarResult.stdout?.trim() || 'unknown tar error';
    throw new Error(`Failed to create package tarball for budget check: ${errorOutput}`);
  }

  const tarballSize = statSync(tarballPath).size;
  unlinkSync(tarballPath);

  return { tarballSize, unpackedSize };
}

function main() {
  const distIndexJs = resolve('dist/index.js');
  const distIndexCss = resolve('dist/index.css');

  const budgets = {
    indexJsRaw: readBudget('HOAM_BUDGET_INDEX_JS_RAW', DEFAULT_BUDGETS.indexJsRaw),
    indexJsGzip: readBudget('HOAM_BUDGET_INDEX_JS_GZIP', DEFAULT_BUDGETS.indexJsGzip),
    indexCssRaw: readBudget('HOAM_BUDGET_INDEX_CSS_RAW', DEFAULT_BUDGETS.indexCssRaw),
    indexCssGzip: readBudget('HOAM_BUDGET_INDEX_CSS_GZIP', DEFAULT_BUDGETS.indexCssGzip),
    packTarball: readBudget('HOAM_BUDGET_PACK_TARBALL', DEFAULT_BUDGETS.packTarball),
    packUnpacked: readBudget('HOAM_BUDGET_PACK_UNPACKED', DEFAULT_BUDGETS.packUnpacked),
  };

  const packageStats = readPackageStats();

  const checks = [
    evaluateBudget({
      label: 'dist/index.js (raw)',
      actual: sizeOfFile(distIndexJs),
      limit: budgets.indexJsRaw,
    }),
    evaluateBudget({
      label: 'dist/index.js (gzip)',
      actual: gzipSizeOfFile(distIndexJs),
      limit: budgets.indexJsGzip,
    }),
    evaluateBudget({
      label: 'dist/index.css (raw)',
      actual: sizeOfFile(distIndexCss),
      limit: budgets.indexCssRaw,
    }),
    evaluateBudget({
      label: 'dist/index.css (gzip)',
      actual: gzipSizeOfFile(distIndexCss),
      limit: budgets.indexCssGzip,
    }),
    evaluateBudget({
      label: 'package tarball (whitelisted files)',
      actual: packageStats.tarballSize,
      limit: budgets.packTarball,
    }),
    evaluateBudget({
      label: 'package unpacked (whitelisted files)',
      actual: packageStats.unpackedSize,
      limit: budgets.packUnpacked,
    }),
  ];

  console.log('\nBundle/package budget check:\n');
  for (const check of checks) {
    const status = check.pass ? 'PASS' : 'FAIL';
    console.log(
      `${status} ${check.label}: ${formatBytes(check.actual)} / ${formatBytes(check.limit)}`
    );
  }

  const failedChecks = checks.filter((check) => !check.pass);

  if (failedChecks.length > 0) {
    console.error('\nOne or more budget checks failed.');
    process.exit(1);
  }

  console.log('\nAll budget checks passed.');
}

main();
