/**
 * Script executado no postinstall. Avisa no terminal se há uma versão
 * mais nova da lib no npm (não impede a instalação).
 */
const path = require('path');
const https = require('https');

const PKG_NAME = 'asaas-sdk-node';
const REGISTRY = `https://registry.npmjs.org/${PKG_NAME}/latest`;

// Só roda quando a lib foi instalada como dependência (está em node_modules)
const parentDir = path.basename(path.dirname(path.dirname(__dirname)));
if (parentDir !== 'node_modules') return;

function parseVersion(v) {
  const parts = (v || '').replace(/[^0-9.]/g, '').split('.').map(Number);
  return { major: parts[0] || 0, minor: parts[1] || 0, patch: parts[2] || 0 };
}

function isNewer(current, latest) {
  const c = parseVersion(current);
  const l = parseVersion(latest);
  if (l.major > c.major) return true;
  if (l.major < c.major) return false;
  if (l.minor > c.minor) return true;
  if (l.minor < c.minor) return false;
  return l.patch > c.patch;
}

function getCurrentVersion() {
  try {
    const pkgPath = path.join(__dirname, '..', 'package.json');
    const pkg = require(pkgPath);
    return pkg.version;
  } catch {
    return null;
  }
}

function fetchLatest() {
  return new Promise((resolve, reject) => {
    const req = https.get(REGISTRY, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.version);
        } catch {
          reject(new Error('Invalid response'));
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(3000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

(async () => {
  const current = getCurrentVersion();
  if (!current) return;
  try {
    const latest = await fetchLatest();
    if (latest && isNewer(current, latest)) {
      console.warn(
        `\n\u001b[33m[${PKG_NAME}]\u001b[0m Há uma versão mais nova disponível: \u001b[32m${latest}\u001b[0m (você está em \u001b[2m${current}\u001b[0m).\n  Atualize com: \u001b[1mnpm install ${PKG_NAME}@latest\u001b[0m\n`
      );
    }
  } catch {
    // Falha silenciosa (rede, timeout, etc.)
  }
})();
