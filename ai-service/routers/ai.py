from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, field_validator
from services.claude import suggest_title_and_category, summarize_post_streaming, analyze_tone

router = APIRouter()


class ExcerptInput(BaseModel):
    excerpt: str

    @field_validator("excerpt")
    @classmethod
    def excerpt_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("excerpt cannot be empty or whitespace")
        return v


@router.post("/suggest")
async def suggest(body: ExcerptInput):
    try:
        result = await suggest_title_and_category(body.excerpt)
        return result
    except RuntimeError as e:
        status = 503 if "529" in str(e) or "overloaded" in str(e).lower() else 500
        raise HTTPException(status_code=status, detail=str(e))
    except Exception as e:
        print(f"[route /suggest] unhandled: {type(e).__name__}: {e}", flush=True)
        raise HTTPException(status_code=500, detail="Unexpected error in suggest endpoint")


@router.post("/summarize")
async def summarize(body: ExcerptInput):
    async def event_stream():
        try:
            async for chunk in summarize_post_streaming(body.excerpt):
                yield f"data: {chunk}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            print(f"[route /summarize] stream error: {type(e).__name__}: {e}", flush=True)
            yield "data: [ERROR]\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.post("/analyze-tone")
async def tone(body: ExcerptInput):
    try:
        result = await analyze_tone(body.excerpt)
        return result
    except RuntimeError as e:
        status = 503 if "529" in str(e) or "overloaded" in str(e).lower() else 500
        raise HTTPException(status_code=status, detail=str(e))
    except Exception as e:
        print(f"[route /analyze-tone] unhandled: {type(e).__name__}: {e}", flush=True)
        raise HTTPException(status_code=500, detail="Unexpected error in analyze-tone endpoint")
