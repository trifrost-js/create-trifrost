# 🧊 create-trifrost

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![CI](https://github.com/trifrost-js/create-trifrost/actions/workflows/ci.yml/badge.svg)](https://github.com/trifrost-js/create-trifrost/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/create-trifrost.svg)](https://www.npmjs.com/package/create-trifrost)
[![npm](https://img.shields.io/npm/dm/create-trifrost.svg)](https://www.npmjs.com/package/create-trifrost)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Ftrifrost-js%2Fcreate-trifrost.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Ftrifrost-js%2Fcreate-trifrost?ref=badge_shield)

> The official project scaffolder for [TriFrost](https://www.trifrost.dev) — create blazing-fast apps in seconds.

[TriFrost](https://github.com/trifrost-js/core) is a blazing-fast, runtime-agnostic server framework built for the modern JavaScript ecosystem — from low-latency edge environments to traditional backend infrastructure.

Whether you're deploying to Node.js, Bun, Cloudflare Workers, or uWebSockets.js, TriFrost provides a unified API and internal architecture that adapts to the runtime — without compromising on performance, developer experience, or clarity.

---

## 🚀 Quick Start

Use this to instantly scaffold a new TriFrost-powered project:

```bash
# NPM
npm create trifrost@latest

# BUN
bun create trifrost@latest
```

---

## ✨ What It Does
`create trifrost` walks you through a beautiful guided CLI setup process, including:
- ✅ Naming your service
- ⚙️ Choosing a runtime (Bun, Node, or Cloudflare Workers)
- 🧩 Picking optional middlewares (CORS, Security, Cache, Rate Limit, ...)
- 💅 Adding CSS and/or TriFrost Atomic script support
- 📦 Setting up Podman if desired
- 📄 Generating a complete project structure and installable environment

---

## 📦 Example Usage
```bash
npm create trifrost
```

And follow the prompts:
```bash
? Where should we create your project? › my-trifrost-app
? Which runtime are you using? › Bun
? Enable CORS middleware? › yes
? Enable CSS reset? › yes
...
```

---

## 🔧 Requirements
**Node**
If using wrangler or node you will need to have at least node 20 installed

**Bun**
If using bun as a runtime you will need to have bun installed

**Containerization**
When containerizing through the creation CLI you will need to have [Podman](https://podman.io) and Podman Compose installed.

---

## 🤝 Contributing
Contributions welcome! If you have ideas for new runtimes, integrations, or starter kits, feel free to open an issue or PR.

---

## 👤 Author
Created and maintained by [Peter Vermeulen](https://github.com/peterver) and the [TriFrost](https://www.trifrost.dev) community

## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Ftrifrost-js%2Fcreate-trifrost.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Ftrifrost-js%2Fcreate-trifrost?ref=badge_large)