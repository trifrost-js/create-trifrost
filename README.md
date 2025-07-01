# ❄️ create-trifrost

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Ftrifrost-js%2Fcreate-trifrost.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Ftrifrost-js%2Fcreate-trifrost?ref=badge_shield&issueType=license)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Ftrifrost-js%2Fcreate-trifrost.svg?type=shield&issueType=security)](https://app.fossa.com/projects/git%2Bgithub.com%2Ftrifrost-js%2Fcreate-trifrost?ref=badge_shield&issueType=security)
[![CI](https://github.com/trifrost-js/create-trifrost/actions/workflows/ci.yml/badge.svg)](https://github.com/trifrost-js/create-trifrost/actions/workflows/ci.yml)

> The official project scaffolder for [TriFrost](https://www.trifrost.dev) — create blazing-fast apps in seconds.

[TriFrost](https://github.com/trifrost-js/core) is a blazing-fast, runtime-agnostic server framework built for the modern JavaScript ecosystem — from low-latency edge environments to traditional backend infrastructure.

Whether you're deploying to Node.js, Bun, or Cloudflare Workers, TriFrost provides a unified API and internal architecture that adapts to the runtime — without compromising on performance, developer experience, or clarity.

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

## 🔐 Security Key Generation
In addition to scaffolding full apps, you can now generate secure JWT-ready secrets and keypairs:
```bash
npm create trifrost@latest
```
Then choose:
```bash
? What are we creating today?
  ❯ Security Keys (JWT/Cookie signing, etc)
```

Supported types:
- `HS256`, `HS384`, `HS512` (HMAC with high-entropy base64 secrets)
- `RS256`, `RS384`, `RS512` (RSA with 2048/4096-bit strength)
- `ES256`, `ES384`, `ES512` (ECDSA with P-256 / P-384 / P-521 curves)

Secrets and keys are safely escaped and saved as `.env`-ready variables:
```bash
# HMAC
SECRET="kAoZfUj3gQxlI9A+Y..."

# RSA/ECDSA
PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvAIBADA..."
PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\nMIIBIjANBg..."
```

Add them to your .env file and you can load them at runtime via ctx.env.SECRET, ctx.env.PRIVATE_KEY, and ctx.env.PUBLIC_KEY, etc.

---

## 📦 Example Usage
```bash
npm create trifrost@latest
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

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Ftrifrost-js%2Fcreate-trifrost.svg?type=large&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Ftrifrost-js%2Fcreate-trifrost?ref=badge_large&issueType=license)
