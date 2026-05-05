from __future__ import annotations

import hashlib
import sys
from typing import Any

from .domain import QueryDef, ToolDef


def stable_unit(*parts: object) -> float:
    raw = "|".join(str(part) for part in parts).encode()
    value = int(hashlib.sha256(raw).hexdigest()[:12], 16)
    return value / float(0xFFFFFFFFFFFF)


def registry_filter(query: QueryDef, tools: list[ToolDef], budget: int) -> list[ToolDef]:
    query_terms = set(query.text.lower().replace(".", "").replace(",", "").split())
    ranked: list[tuple[int, int, float, ToolDef]] = []
    for tool in tools:
        if tool.module not in query.modules:
            continue
        if query.role not in tool.roles:
            continue
        if query.tier not in tool.tiers:
            continue
        overlap = len(query_terms.intersection(tool.keywords))
        ranked.append((overlap, -tool.priority, -stable_unit(query.query_id, tool.name), tool))
    ranked.sort(reverse=True)
    return [tool for *_unused, tool in ranked[:budget]]


def deep_size(value: Any, seen: set[int] | None = None) -> int:
    if seen is None:
        seen = set()
    value_id = id(value)
    if value_id in seen:
        return 0
    seen.add(value_id)
    size = sys.getsizeof(value)
    if isinstance(value, dict):
        size += sum(deep_size(k, seen) + deep_size(v, seen) for k, v in value.items())
    elif isinstance(value, (list, tuple, set, frozenset)):
        size += sum(deep_size(item, seen) for item in value)
    elif hasattr(value, "__dict__"):
        size += deep_size(vars(value), seen)
    return size


def registry_memory(tools: list[ToolDef]) -> int:
    registry: dict[str, dict[str, Any]] = {}
    for tool in tools:
        registry[tool.name] = {
            "module": tool.module,
            "op_type": tool.op_type,
            "roles": tool.roles,
            "tiers": tool.tiers,
            "keywords": tool.keywords,
            "priority": tool.priority,
            "schema_tokens": tool.schema_tokens,
        }
    return deep_size(registry)

