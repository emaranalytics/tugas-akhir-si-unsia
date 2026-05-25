from __future__ import annotations

from .base import LLMBackend, LLMResult
from .adacode import ADACODEBackend
from .gemini import GeminiBackend
from .synthetic import SyntheticBackend

__all__ = [
    "LLMBackend",
    "LLMResult",
    "ADACODEBackend",
    "GeminiBackend",
    "SyntheticBackend",
    "get_backend",
]


def get_backend(config) -> LLMBackend:
    """Factory: return the correct LLMBackend instance for the given EvalConfig."""
    backend = getattr(config, "backend", None)
    if backend == "synthetic":
        return SyntheticBackend()
    elif backend == "gemini":
        return GeminiBackend()
    elif backend == "adacode":
        model_key = getattr(config, "adacode_model", None) or "anthropic"
        return ADACODEBackend(model_key)
    else:
        raise ValueError(f"Unknown backend: {backend!r}")