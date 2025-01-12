from fastapi import APIRouter, HTTPException
from langchain_community.chat_models import ChatOpenAI

from ..models import AnalyzeRequest, AnalyzeResponse
from ...core.analyzer import TextAnalyzer
from ...core.config import settings

router = APIRouter()


def get_llm():
    return ChatOpenAI(
        model_name=settings.MODEL_NAME,
        temperature=settings.TEMPERATURE,
        max_tokens=settings.MAX_TOKENS,
        openai_api_key=settings.OPENAI_API_KEY,
    )


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_text(request: AnalyzeRequest, llm: ChatOpenAI = None):
    if llm is None:
        llm = get_llm()
    try:
        if not request.text:
            raise HTTPException(status_code=400, detail="No text provided")

        analyzer = TextAnalyzer(llm)
        suggestions = await analyzer.analyze_text(request.text)

        return AnalyzeResponse(suggestions=suggestions)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from None
