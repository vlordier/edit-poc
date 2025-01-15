from typing import List
from uuid import uuid4

from pydantic import BaseModel, Field


class Improvement(BaseModel):
    text: str = Field(description="The suggested improved text")
    explanation: str = Field(
        description="Brief explanation of this specific improvement"
    )


class TextSuggestion(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    type: str = Field(
        description="Type of improvement needed: STYLE, CONTENT, TERMINOLOGY, CLARITY, REGULATORY, or CONSISTENCY"
    )
    span: tuple[int, int] = Field(
        description="Exact text span to which this suggestion applies, full text if not provided"
    )
    rationale: str = Field(
        description="Detailed explanation of why this improvement is needed"
    )
    improvements: List[Improvement] = Field(
        description="List of suggested, specific improvements"
    )


class AnalyzeRequest(BaseModel):
    text: str = Field(..., description="Text to be analyzed")


class AnalyzeResponse(BaseModel):
    suggestions: List[TextSuggestion]
