import json
import os
import re
import logging
from anthropic import (
    AsyncAnthropic,
    APIConnectionError,
    APIStatusError,
    APITimeoutError,
    AuthenticationError,
    RateLimitError,
)
from typing import AsyncGenerator

logger = logging.getLogger(__name__)

_api_key = os.getenv("ANTHROPIC_API_KEY")
if not _api_key:
    raise RuntimeError("ANTHROPIC_API_KEY is not set. Add it to ai-service/.env")

client = AsyncAnthropic(api_key=_api_key, max_retries=2, timeout=20.0)

CATEGORIES = ["Agriculture", "Business", "Education", "Entertainment", "Art", "Investment", "Uncategorized", "Weather"]
_MODEL = "claude-haiku-4-5-20251001"


def _get_text(response) -> str:
    if not response.content:
        raise ValueError("Claude returned an empty response")
    block = response.content[0]
    if not hasattr(block, "text"):
        raise ValueError(f"Unexpected response block type: {type(block).__name__}")
    return block.text


def _parse_json(text: str) -> dict:
    text = text.strip()
    fence = re.search(r'```(?:json)?\s*\n?([\s\S]*?)\n?\s*```', text)
    if fence:
        text = fence.group(1).strip()
    return json.loads(text)


async def suggest_title_and_category(excerpt: str) -> dict:
    raw = None
    try:
        response = await client.messages.create(
            model=_MODEL,
            max_tokens=300,
            system=(
                "You are a blog assistant. Given a content excerpt, return ONLY valid JSON "
                "with exactly two keys: "
                "\"titles\" (an array of exactly 3 concise, catchy, SEO-friendly title strings) and "
                f"\"category\" (a single string — the best fit from this list: {', '.join(CATEGORIES)}). "
                "No markdown, no explanation, no extra text. JSON only."
            ),
            messages=[{"role": "user", "content": f"Excerpt:\n{excerpt}"}],
        )
        raw = _get_text(response)
        data = _parse_json(raw)

        if not isinstance(data.get("titles"), list) or len(data["titles"]) == 0:
            raise ValueError(f"'titles' must be a non-empty list. Got: {data}")
        if not isinstance(data.get("category"), str):
            raise ValueError(f"'category' must be a string. Got: {data}")

        return {
            "titles": [str(t) for t in data["titles"][:3]],
            "category": data["category"] if data["category"] in CATEGORIES else "Uncategorized",
        }
    except AuthenticationError:
        raise RuntimeError("Invalid Anthropic API key — check ANTHROPIC_API_KEY in ai-service/.env")
    except RateLimitError:
        raise RuntimeError("AI rate limit reached. Please try again in a moment.")
    except APITimeoutError:
        raise RuntimeError("AI request timed out. Please try again.")
    except APIConnectionError:
        raise RuntimeError("Cannot connect to Anthropic API. Check your network.")
    except APIStatusError as e:
        raise RuntimeError(f"Anthropic API returned HTTP {e.status_code}")
    except (json.JSONDecodeError, ValueError) as e:
        print(f"[suggest] JSON parse error — raw response: {raw!r}", flush=True)
        raise RuntimeError(f"AI returned an unparseable response: {e}")
    except Exception as e:
        print(f"[suggest] unexpected error: {type(e).__name__}: {e}", flush=True)
        raise RuntimeError(f"Unexpected error in suggest: {e}")


async def summarize_post_streaming(excerpt: str) -> AsyncGenerator[str, None]:
    try:
        async with client.messages.stream(
            model=_MODEL,
            max_tokens=300,
            system=(
                "You are a blog summarizer. Write a concise TL;DR summary in 2-4 sentences. "
                "Start directly with the summary content — no preamble, no labels."
            ),
            messages=[{"role": "user", "content": f"Post excerpt:\n{excerpt}"}],
        ) as stream:
            async for text in stream.text_stream:
                yield text
    except AuthenticationError:
        raise RuntimeError("Invalid Anthropic API key")
    except RateLimitError:
        raise RuntimeError("AI rate limit reached. Please try again.")
    except APITimeoutError:
        raise RuntimeError("AI request timed out.")
    except APIConnectionError:
        raise RuntimeError("Cannot connect to Anthropic API.")
    except APIStatusError as e:
        raise RuntimeError(f"Anthropic API returned HTTP {e.status_code}")
    except Exception as e:
        print(f"[summarize] unexpected error: {type(e).__name__}: {e}", flush=True)
        raise RuntimeError(f"Unexpected error during summarization: {e}")


async def analyze_tone(excerpt: str) -> dict:
    raw = None
    try:
        response = await client.messages.create(
            model=_MODEL,
            max_tokens=200,
            system=(
                "You are a writing tone analyzer. Analyze the given blog excerpt and return ONLY valid JSON "
                "with exactly five keys: "
                "\"tone\" (e.g. Formal, Casual, Neutral), "
                "\"sentiment\" (Positive, Neutral, or Negative), "
                "\"style\" (e.g. Confident, Conversational, Academic, Balanced), "
                "\"audience\" (e.g. General, Professional, Academic), "
                "\"tip\" (one short actionable sentence to improve the writing). "
                "No markdown, no explanation. JSON only."
            ),
            messages=[{"role": "user", "content": f"Excerpt:\n{excerpt}"}],
        )
        raw = _get_text(response)
        data = _parse_json(raw)

        required = {"tone", "sentiment", "style", "audience", "tip"}
        missing = required - set(data.keys())
        if missing:
            raise ValueError(f"Response missing keys: {missing}")

        return {k: str(data[k]) for k in required}
    except AuthenticationError:
        raise RuntimeError("Invalid Anthropic API key — check ANTHROPIC_API_KEY in ai-service/.env")
    except RateLimitError:
        raise RuntimeError("AI rate limit reached. Please try again in a moment.")
    except APITimeoutError:
        raise RuntimeError("AI request timed out. Please try again.")
    except APIConnectionError:
        raise RuntimeError("Cannot connect to Anthropic API. Check your network.")
    except APIStatusError as e:
        raise RuntimeError(f"Anthropic API returned HTTP {e.status_code}")
    except (json.JSONDecodeError, ValueError) as e:
        print(f"[analyze_tone] JSON parse error — raw response: {raw!r}", flush=True)
        raise RuntimeError(f"AI returned an unparseable response: {e}")
    except Exception as e:
        print(f"[analyze_tone] unexpected error: {type(e).__name__}: {e}", flush=True)
        raise RuntimeError(f"Unexpected error in analyze_tone: {e}")
