#!/usr/bin/env python3
"""
Serve the `src/` directory and return `src/404.html` for any missing path.

Usage:
  python3 serve_with_404.py

This binds to localhost:8000 by default. Press Ctrl-C to stop.
"""
from http.server import SimpleHTTPRequestHandler, HTTPServer
import os
import sys

ROOT = os.path.join(os.getcwd(), 'src')
PORT = 8000

class Handler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        # Serve files from the `src` folder instead of the current working directory
        # Remove query string and leading '/'
        path = path.split('?',1)[0].split('#',1)[0]
        if path.startswith('/'):
            path = path[1:]
        # Default to index.html when requesting directory
        if not path:
            path = 'index.html'
        full = os.path.join(ROOT, path)
        return full

    def send_error(self, code, message=None):
        # On 404, return the custom 404 page if available
        if code == 404:
            not_found_path = os.path.join(ROOT, '404.html')
            if os.path.exists(not_found_path):
                try:
                    with open(not_found_path, 'rb') as fh:
                        self.send_response(200)
                        self.send_header('Content-type', 'text/html')
                        self.end_headers()
                        self.wfile.write(fh.read())
                        return
                except Exception:
                    pass
        # Fallback to default behavior
        super().send_error(code, message)

if __name__ == '__main__':
    os.chdir(ROOT)
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, Handler)
    print(f"Serving {ROOT} at http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\nStopping server')
        httpd.server_close()
        sys.exit(0)
