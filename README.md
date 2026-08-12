# srckit-echo

<p align="center">
  <strong>Send HTTP requests and build mock responses — all from your browser.</strong>
</p>

<p align="center">
  <a href="https://echo.srckit.org">Live Demo</a> ·
  <a href="https://github.com/srckit-org/srckit">SrKit Suite</a> ·
  <a href="https://github.com/srckit-org/srckit-echo/issues">Report Bug</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/react-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/MUI-9-007FFF?style=flat-square&logo=mui&logoColor=white" alt="MUI 9" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind 4" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript 6" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/github/license/srckit-org/srckit-echo?style=flat-square" alt="License" />
</p>

---

## Overview

srckit-echo is a developer tool for testing HTTP requests and building mock API responses. Whether you need to debug an API endpoint, test a webhook handler, or create mock responses for frontend development, srckit-echo has you covered.

## Features

### Request Echo
- **Full HTTP client** — support for GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
- **Custom headers** — add any request headers
- **Request body** — send JSON, form data, or raw text
- **Response display** — status code, headers, body, duration, size
- **Real requests** — actually sends requests to the target URL

### Response Builder
- **Status codes** — choose from common HTTP status codes
- **Custom headers** — add response headers
- **Response body** — craft JSON, HTML, or plain text responses
- **Raw preview** — see the complete HTTP response format
- **Presets** — quick templates for common responses (200, 404, 500, etc.)

## Getting Started

```bash
git clone https://github.com/srckit-org/srckit-echo.git
cd srckit-echo
npm install
npm run dev
```

## API Endpoints for Testing

Try these public APIs with the Request Echo:

| URL | Method | Description |
|-----|--------|-------------|
| `https://httpbin.org/get` | GET | Returns request headers |
| `https://httpbin.org/post` | POST | Echoes POST data |
| `https://jsonplaceholder.typicode.com/posts/1` | GET | Sample JSON data |
| `https://api.github.com` | GET | GitHub API root |

## License

MIT © [srckit-org](https://github.com/srckit-org)
