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
        description="Start and end indices of the text to improve"
    )
    rationale: str = Field(
        description="Detailed explanation of why this improvement is needed"
    )
    improvements: List[Improvement] = Field(
        description="List of suggested improvements"
    )


class AnalyzeRequest(BaseModel):
    text: str


class AnalyzeResponse(BaseModel):
    suggestions: List[TextSuggestion]
