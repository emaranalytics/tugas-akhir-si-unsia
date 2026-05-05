from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class ToolDef:
    name: str
    module: str
    op_type: str
    roles: list[str]
    tiers: list[str]
    keywords: list[str]
    priority: int
    schema_tokens: int
    intent: str = ""  # docstring-style one-liner: what this tool does and when to use it


@dataclass(frozen=True)
class QueryDef:
    query_id: str
    query_type: str
    text: str
    modules: list[str]
    role: str
    tier: str
    expected_tool: str

