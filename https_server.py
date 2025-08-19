#!/usr/bin/env python3
"""
Simple HTTPS server for testing Square Web Payments SDK
"""

import http.server
import ssl
import tempfile
import os
from pathlib import Path

def create_self_signed_cert():
    """自己署名証明書を作成"""
    import subprocess
    
    # 一時ディレクトリ
    temp_dir = tempfile.mkdtemp()
    cert_file = os.path.join(temp_dir, "cert.pem")
    key_file = os.path.join(temp_dir, "key.pem")
    
    try:
        # 自己署名証明書を作成
        cmd = [
            'openssl', 'req', '-x509', '-newkey', 'rsa:4096', '-keyout', key_file,
            '-out', cert_file, '-days', '365', '-nodes', '-subj',
            '/C=JP/ST=Tokyo/L=Tokyo/O=Test/OU=Test/CN=localhost'
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✅ 証明書作成成功: {cert_file}")
            return cert_file, key_file
        else:
            print(f"❌ 証明書作成失敗: {result.stderr}")
            return None, None
            
    except FileNotFoundError:
        print("❌ OpenSSLが見つかりません")
        return None, None

def start_https_server(port=8443):
    """HTTPSサーバーを起動"""
    
    # 証明書作成
    cert_file, key_file = create_self_signed_cert()
    
    if not cert_file or not key_file:
        print("⚠️ 証明書作成に失敗しました。HTTPサーバーで起動します...")
        # HTTPサーバーにフォールバック
        server = http.server.HTTPServer(('', 8000), http.server.SimpleHTTPRequestHandler)
        print(f"🌐 HTTPサーバー起動: http://localhost:8000/")
        print("⚠️ Square Web Payments SDKは動作しませんが、他の機能はテスト可能です")
        server.serve_forever()
        return
    
    # HTTPSサーバー設定
    server = http.server.HTTPServer(('', port), http.server.SimpleHTTPRequestHandler)
    
    # SSL設定
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain(cert_file, key_file)
    
    server.socket = context.wrap_socket(server.socket, server_side=True)
    
    print(f"🔒 HTTPSサーバー起動: https://localhost:{port}/")
    print("⚠️ 自己署名証明書のため、ブラウザで「詳細設定」→「安全でないページに移動」を選択してください")
    print(f"📁 証明書ファイル: {cert_file}")
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 サーバーを停止しました")
        # 一時ファイルを削除
        try:
            os.unlink(cert_file)
            os.unlink(key_file)
            os.rmdir(os.path.dirname(cert_file))
        except:
            pass

if __name__ == "__main__":
    start_https_server()
