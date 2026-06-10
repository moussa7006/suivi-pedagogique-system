#!/usr/bin/env python3
"""Serveur mobile statique + proxy API pour tests téléphone/relais.

- Sert mobile-ionic/www sur le port 8100.
- Redirige /api/* vers http://localhost:8099/api/*.

Ainsi, le mobile peut utiliser apiBaseUrl: '/api' et un seul tunnel relais suffit.
"""

from __future__ import annotations

import argparse
import http.client
import mimetypes
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit


class MobileProxyHandler(BaseHTTPRequestHandler):
    www_dir: Path
    backend_host: str
    backend_port: int

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Authorization,Content-Type")
        self.end_headers()

    def do_GET(self) -> None:
        if self.path.startswith("/api/"):
            self.proxy_request()
        else:
            self.serve_static()

    def do_POST(self) -> None:
        if self.path.startswith("/api/"):
            self.proxy_request()
        else:
            self.send_error(404)

    def do_PUT(self) -> None:
        if self.path.startswith("/api/"):
            self.proxy_request()
        else:
            self.send_error(404)

    def do_DELETE(self) -> None:
        if self.path.startswith("/api/"):
            self.proxy_request()
        else:
            self.send_error(404)

    def proxy_request(self) -> None:
        content_length = int(self.headers.get("Content-Length", "0") or "0")
        body = self.rfile.read(content_length) if content_length else None

        headers = {
            key: value
            for key, value in self.headers.items()
            if key.lower()
            not in {"host", "content-length", "accept-encoding", "connection"}
        }

        conn = http.client.HTTPConnection(
            self.backend_host, self.backend_port, timeout=30
        )
        try:
            conn.request(self.command, self.path, body=body, headers=headers)
            response = conn.getresponse()
            data = response.read()

            self.send_response(response.status)
            for key, value in response.getheaders():
                if key.lower() in {"transfer-encoding", "connection", "content-length"}:
                    continue
                self.send_header(key, value)
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
        except Exception as exc:
            message = f"API proxy error: {exc}".encode("utf-8")
            self.send_response(502)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.send_header("Content-Length", str(len(message)))
            self.end_headers()
            self.wfile.write(message)
        finally:
            conn.close()

    def serve_static(self) -> None:
        parsed = urlsplit(self.path)
        relative = parsed.path.lstrip("/")

        if not relative:
            relative = "index.html"

        target = (self.www_dir / relative).resolve()
        if not str(target).startswith(str(self.www_dir.resolve())):
            self.send_error(403)
            return

        if not target.exists() or target.is_dir():
            target = self.www_dir / "index.html"

        content_type = (
            mimetypes.guess_type(str(target))[0] or "application/octet-stream"
        )
        data = target.read_bytes()

        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, fmt: str, *args: object) -> None:
        print(f"{self.address_string()} - {fmt % args}")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8100)
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--backend-host", default="localhost")
    parser.add_argument("--backend-port", type=int, default=8099)
    parser.add_argument("--www", default="mobile-ionic/www")
    args = parser.parse_args()

    www_dir = Path(args.www).resolve()
    if not www_dir.exists():
        raise SystemExit(
            f"Dossier introuvable: {www_dir}. Lance d'abord npm --prefix mobile-ionic run build"
        )

    MobileProxyHandler.www_dir = www_dir
    MobileProxyHandler.backend_host = args.backend_host
    MobileProxyHandler.backend_port = args.backend_port

    server = ThreadingHTTPServer((args.host, args.port), MobileProxyHandler)
    print(f"Mobile + API proxy: http://{args.host}:{args.port}")
    print(f"Static dir: {www_dir}")
    print(f"API proxy: /api -> http://{args.backend_host}:{args.backend_port}/api")
    server.serve_forever()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
