import os, sys
os.chdir("/Users/alshangiti/Desktop/tafsir-notes")
import http.server, socketserver
PORT = 5174
handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", PORT), handler) as httpd:
    httpd.serve_forever()
