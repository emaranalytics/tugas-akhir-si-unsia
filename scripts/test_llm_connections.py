"""
Test connection for all LLM models via ADACODE API.

Usage:
    python scripts/test_llm_connections.py
"""

import os
import json
import httpx
from dotenv import load_dotenv
from pathlib import Path

# Load .env
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)

BASE_URL = os.getenv("ADACODE_BASE_URL", "https://api.adacode.ai/v1").rstrip("/")
API_KEY = os.getenv("ADACODE_API_KEY")

MODELS = {
    "ANTHROPIC_SONNET_MODEL": os.getenv("ANTHROPIC_SONNET_MODEL"),
    "GLM_FLASH_MODEL": os.getenv("GLM_FLASH_MODEL"),
    "MINIMAX_M_MODEL": os.getenv("MINIMAX_M_MODEL"),
}

SYSTEM_PROMPT = "Kamu adalah asisten AI yang membantu. Jawab hanya dengan nama model yang sedang digunakan, contoh: Model: xxx"
USER_PROMPT = "Apa nama model yang sedang digunakan?"


def test_model(model_key: str, model_name: str) -> bool:
    """Send a simple test request to a model and report success/failure."""
    payload = {
        "model": model_name,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": USER_PROMPT},
        ],
        "temperature": 0.7,
        "max_tokens": 100,
    }
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }
    try:
        with httpx.Client(base_url=BASE_URL, timeout=30.0) as client:
            r = client.post("/chat/completions", json=payload, headers=headers)
            r.raise_for_status()
            content = r.json()["choices"][0]["message"]["content"]
            print(f"  [OK] {content.strip()}")
            return True
    except Exception as e:
        print(f"  [FAIL] {type(e).__name__}: {e}")
        return False


def main():
    if not API_KEY:
        print("ERROR: ADACODE_API_KEY is not set in .env")
        return

    print(f"ADACODE base URL : {BASE_URL}")
    print(f"Testing {len(MODELS)} model(s)...\n")

    results = {}
    for key, model_name in MODELS.items():
        print(f"[{key}] model={model_name}")
        results[key] = test_model(key, model_name)
        print()

    ok = sum(results.values())
    print("=" * 40)
    print(f"Summary: {ok}/{len(results)} passed")


if __name__ == "__main__":
    main()