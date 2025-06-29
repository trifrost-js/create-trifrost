# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
