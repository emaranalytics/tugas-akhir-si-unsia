from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass

from ..domain import QueryDef, ToolDef


@dataclass(frozen=True)
class LLMResult:
    """Result from a single LLM call."""
    selected_tool: str
    input_tokens: int
    output_tokens: int
    total_tokens: int
    latency_ms: float
    error: str | None = None


class LLMBackend(ABC):
    """Abstract interface for LLM evaluation backends."""

    @property
    @abstractmethod
    def name(self) -> str:
        """Short backend name, e.g. 'synthetic', 'gemini-native', 'adacode-anthropic'."""

    @abstractmethod
    def call(
        self,
        mode: str,
        scenario: str,
        query: QueryDef,
        tools_for_scenario: list[ToolDef],
        registry_memory_bytes: int,
        config: object,
        repeat_idx: int = 0,
    ) -> dict:
        """Execute one query with visible tools. Return a row dict matching the JSONL schema."""