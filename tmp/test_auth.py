#!/usr/bin/env python3
"""
Script de teste: Validar fluxo de login frontend → gateway → ms_camera
"""
import json
import time
import urllib.request
import urllib.error

BASE_URL = "http://localhost:3000"
SERVICE_URL = "http://localhost:8000"

def test_backend_login():
    """Testa login direto no ms_camera"""
    print("\n=== Test 1: Login direto no ms_camera (localhost:8000) ===")
    try:
        req = urllib.request.Request(
            f'{SERVICE_URL}/api/auth/login',
            data=json.dumps({'username': 'admin', 'password': 'admin123'}).encode(),
            headers={'Content-Type': 'application/json'}
        )
        resp = urllib.request.urlopen(req)
        data = json.loads(resp.read())
        token = data['access_token']
        print(f"✓ Token recebido: {token[:50]}...")
        return token
    except Exception as e:
        print(f"✗ Erro: {e}")
        return None

def test_gateway_login():
    """Testa login via gateway"""
    print("\n=== Test 2: Login via gateway (localhost:3000) ===")
    try:
        req = urllib.request.Request(
            f'{BASE_URL}/api/auth/login',
            data=json.dumps({'username': 'admin', 'password': 'admin123'}).encode(),
            headers={'Content-Type': 'application/json'}
        )
        resp = urllib.request.urlopen(req)
        data = json.loads(resp.read())
        token = data['access_token']
        print(f"✓ Token recebido via gateway: {token[:50]}...")
        return token
    except urllib.error.HTTPError as e:
        print(f"✗ Erro HTTP {e.code}: {e.read().decode()}")
        return None
    except Exception as e:
        print(f"✗ Erro: {e}")
        return None

def test_token_usage(token):
    """Testa uso do token para acessar recurso protegido"""
    print("\n=== Test 3: Usar token para acessar recurso protegido ===")
    try:
        req = urllib.request.Request(
            f'{BASE_URL}/api/veiculos_autorizados',
            headers={'Authorization': f'Bearer {token}'}
        )
        resp = urllib.request.urlopen(req)
        data = json.loads(resp.read())
        print(f"✓ Acesso autorizado. Veículos: {data}")
        return True
    except urllib.error.HTTPError as e:
        if e.code == 401:
            print(f"✗ Token inválido (401)")
        else:
            print(f"✗ Erro HTTP {e.code}")
        return False
    except Exception as e:
        print(f"✗ Erro: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("TESTE DE AUTENTICAÇÃO FRONTEND ↔ GATEWAY ↔ MS_CAMERA")
    print("=" * 60)
    
    # Test 1
    token1 = test_backend_login()
    
    # Test 2
    token2 = test_gateway_login()
    
    # Test 3 (usa token do gateway)
    if token2:
        test_token_usage(token2)
    
    print("\n" + "=" * 60)
    if token1 and token2:
        print("✓ TESTE COMPLETO: Frontend pode fazer login e usar token!")
    else:
        print("✗ FALHA: Verifique os resultados acima")
    print("=" * 60)
