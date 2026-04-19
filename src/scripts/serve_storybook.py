from __future__ import annotations

from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os


class QuietStorybookServer(ThreadingHTTPServer):
    daemon_threads = True

    def handle_error(self, request, client_address):  # type: ignore[override]
        # Browsers frequently abort video or asset requests once a test moves on.
        # Treat those disconnects as expected instead of printing noisy tracebacks.
        pass


def main() -> None:
    root = Path(__file__).resolve().parents[2] / "storybook-static"
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "6006"))
    handler = partial(SimpleHTTPRequestHandler, directory=str(root))

    with QuietStorybookServer((host, port), handler) as server:
        print(f"Storybook static server running at http://{host}:{port}")
        server.serve_forever()


if __name__ == "__main__":
    main()
