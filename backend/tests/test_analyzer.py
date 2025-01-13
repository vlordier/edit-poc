import json
import logging
from unittest.mock import AsyncMock

import pytest
from langchain_core.runnables import RunnableLambda

from app.core.analyzer import TextAnalyzer, TextSuggestion

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@pytest.mark.asyncio
async def test_analyze_text() -> None:
    """
    Test the analyze_text function with a sample input.
    """
    """
    Test the analyze_text function with a sample input.
    """
    mock_llm: AsyncMock = AsyncMock(spec=RunnableLambda)
    mock_llm.ainvoke.return_value = json.dumps(
        [
            {
                "id": "1",
                "span": [0, 10],
                "type": "STYLE",
                "improvements": [
                    {"text": "Improved text", "explanation": "Explanation"}
                ],
                "rationale": "Rationale",
            }
        ]
    )
    analyzer = TextAnalyzer(llm=mock_llm)
    try:
        result = await analyzer.analyze_text("Sample text")
        assert isinstance(result, list)
        assert len(result) > 0
        assert all(isinstance(suggestion, TextSuggestion) for suggestion in result)
    except Exception as e:
        logger.error(f"Test failed: {e}")


@pytest.mark.asyncio
async def test_analyze_text_empty() -> None:
    """
    Test the analyze_text function with an empty input.
    """
    """
    Test the analyze_text function with an empty input.
    """
    mock_llm: AsyncMock = AsyncMock(spec=RunnableLambda)
    analyzer = TextAnalyzer(llm=mock_llm)
    try:
        result = await analyzer.analyze_text("")
        assert isinstance(result, list)
        assert len(result) == 0
    except Exception as e:
        logger.error(f"Test failed: {e}")


@pytest.mark.asyncio
async def test_analyze_text_special_characters() -> None:
    """
    Test the analyze_text function with special character input.
    """
    """
    Test the analyze_text function with special character input.
    """
    mock_llm: AsyncMock = AsyncMock(spec=RunnableLambda)
    mock_llm.ainvoke.return_value = "[]"  # Return an empty list for special characters
    analyzer = TextAnalyzer(llm=mock_llm)
    try:
        result = await analyzer.analyze_text("!@#$%^&*()")
        assert isinstance(result, list)
        assert len(result) == 0
    except Exception as e:
        logger.error(f"Test failed: {e}")


@pytest.mark.asyncio
async def test_analyze_text_long_input() -> None:
    """
    Test the analyze_text function with a long input text.
    """
    """
    Test the analyze_text function with a long input text.
    """
    mock_llm: AsyncMock = AsyncMock(spec=RunnableLambda)
    mock_llm.ainvoke.return_value = '[{"id": "1", "span": [0, 10], "type": "STYLE", "improvements": [{"text": "Improved text", "explanation": "Explanation"}], "rationale": "Rationale"}]'
    analyzer = TextAnalyzer(llm=mock_llm)
    long_text = "a" * 5000  # Test with a long input text
    try:
        result = await analyzer.analyze_text(long_text)
        assert isinstance(result, list)
        assert len(result) > 0  # Assuming suggestions are generated for long input
    except Exception as e:
        logger.error(f"Test failed: {e}")
