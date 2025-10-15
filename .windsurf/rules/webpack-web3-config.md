# Webpack Configuration for Web3

## Required Configuration

The Solana Wallet Adapter and WalletConnect dependencies require specific webpack configuration to work in Next.js.

### Pattern

```javascript
// next.config.mjs
webpack: (config, { isServer }) => {
  if (isServer) {
    config.externals = [...(config.externals || [])];
  }

  // Fix for Solana wallet adapter and WalletConnect dependencies
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    net: false,
    tls: false,
    crypto: false,
    stream: false,
    http: false,
    https: false,
    zlib: false,
    path: false,
    os: false,
    "pino-pretty": false,
  };

  // Ignore pino-pretty warnings
  config.ignoreWarnings = [
    { module: /pino-pretty/ },
    { module: /node_modules\/pino/ },
  ];

  return config;
};
```

## Why This Is Required

1. **Node.js Modules**: Wallet adapters depend on Node.js-only modules that don't exist in browsers
2. **WalletConnect**: Uses `pino` logger which requires Node.js modules
3. **Browser Safety**: Setting fallbacks to `false` prevents bundling unnecessary code

## What This Does

### Fallback Configuration

- Tells webpack to exclude Node.js built-in modules
- Prevents "Module not found" errors
- Keeps browser bundle clean

### Ignore Warnings

- Suppresses warnings about missing pino modules
- Doesn't affect functionality
- Keeps console clean during development

## Best Practices

1. **Always include this config** when using Solana wallet adapter
2. **Add comment explaining purpose** for future maintainers
3. **Keep fallback list comprehensive** - include all Node.js modules
4. **Test build after changes** - run `npm run build` to verify

## Troubleshooting

### Still seeing pino errors?

```bash
rm -rf .next
npm install
npm run dev
```

### Build fails with other module errors?

Add the missing module to `config.resolve.fallback`:

```javascript
config.resolve.fallback = {
  ...config.resolve.fallback,
  "missing-module": false,
};
```

## Anti-Patterns

❌ Installing `pino-pretty` to satisfy the dependency (adds unnecessary code)
❌ Removing wallet adapter packages to avoid the issue (loses functionality)
❌ Using different webpack loaders (overcomplicates the solution)
❌ Ignoring the warnings without fixing the root cause

## When to Update

- Adding new wallet adapters
- Upgrading `@solana/wallet-adapter-*` packages
- Encountering new Node.js module errors
- Next.js major version upgrades
