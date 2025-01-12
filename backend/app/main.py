from typing import List, Dict, Any
from langchain.graphs import Graph
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from uuid import uuid4

# Output models for structured LLM responses
class Improvement(BaseModel):
    text: str = Field(description="The suggested improved text")
    explanation: str = Field(description="Brief explanation of this specific improvement")

class TextSuggestion(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    type: str = Field(description="Type of improvement needed")
    span: tuple[int, int] = Field(description="Start and end indices of the text to improve")
    rationale: str = Field(description="Detailed explanation of why this improvement is needed")
    improvements: List[Improvement] = Field(description="List of suggested improvements")

class TextAnalyzer:
    def __init__(self, llm):
        self.llm = llm
        self.setup_chains()

    def setup_chains(self):
        # Parser for structured output
        self.parser = PydanticOutputParser(pydantic_object=TextSuggestion)

        # Prompt for analyzing text
        analyze_prompt = PromptTemplate(
            template="""Analyze the following text and suggest improvements:

Text: {text}

Focus on one specific issue at a time. For each issue:
1. Identify the specific span of text that needs improvement
2. Determine the type of improvement needed (CLARITY, GRAMMAR, STYLE, TECHNICAL, CONSISTENCY)
3. Provide a detailed rationale for the improvement
4. Suggest two different ways to improve the text

Format your response exactly according to this JSON schema:
{format_instructions}

Remember to:
- Be specific and actionable
- Provide clear rationale
- Suggest realistic improvements
- Maintain the original meaning

Suggestion:""",
            input_variables=["text"],
            partial_variables={"format_instructions": self.parser.get_format_instructions()}
        )

        self.analyze_chain = LLMChain(
            llm=self.llm,
            prompt=analyze_prompt,
            output_parser=self.parser
        )

    async def analyze_text(self, text: str) -> List[TextSuggestion]:
        """Analyze text and generate improvement suggestions."""
        # Create graph for tracking analysis flow
        graph = Graph()
        
        # Add initial text node
        graph.add_node("text", {"content": text})
        
        # Generate suggestions
        suggestions = []
        
        # We'll analyze the text in chunks if it's long
        text_chunks = self._split_text(text)
        
        for chunk in text_chunks:
            result = await self.analyze_chain.arun(text=chunk)
            
            # Adjust span indices based on chunk position
            result.span = (
                result.span[0] + chunk["start_idx"],
                result.span[1] + chunk["start_idx"]
            )
            
            suggestions.append(result)
            
            # Add suggestion to graph
            graph.add_node(result.id, {
                "type": "suggestion",
                "content": result.dict()
            })
            
            # Connect suggestion to text
            graph.add_edge("text", result.id, "suggests_improvement")

        return suggestions

    def _split_text(self, text: str, max_chunk_size: int = 1000) -> List[Dict[str, Any]]:
        """Split text into manageable chunks while preserving context."""
        if len(text) <= max_chunk_size:
            return [{"text": text, "start_idx": 0}]

        chunks = []
        start = 0
        
        while start < len(text):
            # Find a good breaking point
            end = min(start + max_chunk_size, len(text))
            if end < len(text):
                # Try to break at a sentence boundary
                while end > start and text[end] not in '.!?':
                    end -= 1
                if end == start:  # No good breaking point found
                    end = start + max_chunk_size
            
            chunks.append({
                "text": text[start:end],
                "start_idx": start
            })
            start = end

        return chunks

    def apply_suggestion(self, text: str, suggestion: TextSuggestion, improvement_index: int) -> str:
        """Apply a selected improvement to the text."""
        start, end = suggestion.span
        improvement = suggestion.improvements[improvement_index]
        
        return text[:start] + improvement.text + text[end:]

# FastAPI endpoint implementation
from fastapi import FastAPI, HTTPException
from typing import List

app = FastAPI()

@app.post("/api/analyze")
async def analyze_text(request: Dict[str, str]):
    try:
        text = request.get("text")
        if not text:
            raise HTTPException(status_code=400, detail="No text provided")
            
        analyzer = TextAnalyzer(llm)  # Initialize with your LLM
        suggestions = await analyzer.analyze_text(text)
        
        return {"suggestions": [s.dict() for s in suggestions]}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))