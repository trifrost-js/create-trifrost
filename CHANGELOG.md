# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.9.0] - 2025-07-07
### Improved
- **feat**: Add `Module` export to script.mjs factory

## [0.8.1] - 2025-07-05
### Fixed
- **qol**: Remove themeAttribute as no longer available

## [0.8.0] - 2025-07-05
### Improved
- **qol**: Adjust helloworld kit to new css script setup

## [0.7.1] - 2025-07-02
### Fixed
- Fix issue where types.ts instead of types is used for import

## [0.7.0] - 2025-07-02
### Improved
- **qol**: Update hello world kit to latest 0.43.0 changes

## [0.6.0] - 2025-07-02
### Improved
- **qol**: `Env` now gets passed to createScript in hello world kit

## [0.5.0] - 2025-07-01
### Added
- **feat**: Extend create-trifrost CLI with unified security key generation flow for JWT and cookie signing.
- **feat**: Added support for the following algorithms via the Security Keys flow: `HS256`, `HS384`, `HS512` (HMAC), `RS256`, `RS384`, `RS512` (RSA with selectable 2048/4096-bit strength), `ES256`, `ES384`, `ES512` (ECDSA with P-256, P-384, P-521)
- **feat**: All generated keys are output as `keys.env` to a path of your choosing with proper escaping and cross-runtime compatibility.

### Changed
- **improve**: Reworked CLI structure, now begins with a clear `What are we creating today?` task selector (`project` or `security-keys`), simplifying guided flows.

## [0.4.0] - 2025-07-01
### Improved
- Removed `<Style />` injection as no longer necessary since TriFrost 0.42.x

## [0.3.0] - 2025-06-29
### Improved
- Add `DOM` to standard lib for tsconfig in node/cloudflare_workers

## [0.2.0] - 2025-06-29
### Improved
- Dev dependencies are now pinned to the latest within their major for the node/bun/workerd runtimes
- Removed `.boot({port: ...})` behavior as no longer necessary to pass given `TRIFROST_PORT` is now canonical

## [0.1.1] - 2025-06-24
### Fixed
- Add missing favicon file

## [0.1.0] - 2025-06-24
### Added
- Initial release of `create-trifrost`
- Interactive CLI wizard with full prompt-based scaffolding
- Support for multiple runtime targets: `Node.js`, `Node.js + Podman`, `Bun`, `Bun + Podman`, `Cloudflare Workers (Workerd)`
- Hello World project generator with: **CORS** & **Security** middleware toggles, **Script** & **TriFrost Atomic** scripting options, **CSS baseline** with optional **reset**
- Auto-generated `.env`, `.prettierrc`, ESLint setup, and TypeScript config
- Podman-compatible `Containerfile` and `compose.yml` with shared network support
