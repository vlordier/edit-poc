from unittest.mock import AsyncMock, patch

from fastapi import HTTPException

from app.core.analyzer import TextAnalyzer


@patch("app.api.routes.analyze.ChatOpenAI")
@patch.object(TextAnalyzer, "analyze_text", return_value=[])
def test_analyze_endpoint(mock_analyze_text, mock_chat_openai, client):
    mock_chat_openai.return_value.analyze_text = AsyncMock(return_value=[])
    response = client.post("/api/analyze", json={"text": "Sample text for analysis"})
    assert response.status_code == 200
    assert "suggestions" in response.json()
    mock_analyze_text.assert_awaited_once()


@patch("app.api.routes.analyze.ChatOpenAI")
@patch.object(TextAnalyzer, "analyze_text", return_value=[])
def test_analyze_endpoint_no_text(mock_analyze_text, mock_chat_openai, client):
    response = client.post("/api/analyze", json={"text": ""})
    assert response.status_code == 400
    assert response.json()["detail"] == "No text provided"


@patch("app.api.routes.analyze.ChatOpenAI")
@patch.object(
    TextAnalyzer,
    "analyze_text",
    side_effect=HTTPException(status_code=500, detail="Service error"),
)
def test_analyze_endpoint_service_failure(mock_analyze_text, mock_chat_openai, client):
    response = client.post("/api/analyze", json={"text": "Sample text for analysis"})
    assert response.status_code == 500
    assert response.json()["detail"] == "Service error"
