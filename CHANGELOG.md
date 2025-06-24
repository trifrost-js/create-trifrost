# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Initial release of `create-trifrost`
- Interactive CLI wizard with full prompt-based scaffolding
- Support for multiple runtime targets: `Node.js`, `Node.js + Podman`, `Bun`, `Bun + Podman`, `Cloudflare Workers (Workerd)`
- Hello World project generator with: **CORS** & **Security** middleware toggles, **Script** & **TriFrost Atomic** scripting options, **CSS baseline** with optional **reset**
- Auto-generated `.env`, `.prettierrc`, ESLint setup, and TypeScript config
- Podman-compatible `Containerfile` and `compose.yml` with shared network support
