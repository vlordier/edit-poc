from typing import Any, Dict, List

from langchain.chains import LLMChain
from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import PromptTemplate

from ..api.models import TextSuggestion


class TextAnalyzer:
    def __init__(self, llm):
        self.llm = llm
        self.setup_chains()

    def setup_chains(self):
        self.parser = PydanticOutputParser(pydantic_object=TextSuggestion)

        analyze_prompt = PromptTemplate(
            template="""You are an experienced medical writer specializing in clinical report studies.
Analyze the following text and suggest improvements:

Text: {text}

Focus on one specific issue at a time. For each issue:
1. Identify the specific span of text that needs improvement
2. Determine the type of improvement needed from these categories:
   - STYLE: Issues with writing style, tone, or flow
   - CONTENT: Inaccurate or missing clinical information
   - TERMINOLOGY: Incorrect or inconsistent medical terminology
   - CLARITY: Unclear or ambiguous statements
   - REGULATORY: Non-compliance with regulatory guidelines
   - CONSISTENCY: Inconsistencies within the document
3. Provide a detailed medical rationale for the improvement
4. Suggest two different ways to improve the text using appropriate medical writing standards

Format your response exactly according to this JSON schema:
{format_instructions}

Remember to:
- Be specific and actionable
- Provide clear medical rationale
- Suggest realistic improvements that maintain scientific accuracy
- Use appropriate medical terminology
- Consider regulatory compliance

Suggestion:""",
            input_variables=["text"],
            partial_variables={
                "format_instructions": self.parser.get_format_instructions()
            },
        )

        self.analyze_chain = LLMChain(
            llm=self.llm, prompt=analyze_prompt, output_parser=self.parser
        )

    async def analyze_text(self, text: str) -> List[TextSuggestion]:
        suggestions = []
        text_chunks = self._split_text(text)

        for chunk in text_chunks:
            result = await self.analyze_chain.arun(text=chunk)
            result.span = (
                result.span[0] + chunk["start_idx"],
                result.span[1] + chunk["start_idx"],
            )
            suggestions.append(result)

        return suggestions

    def _split_text(
        self, text: str, max_chunk_size: int = 1000
    ) -> List[Dict[str, Any]]:
        if len(text) <= max_chunk_size:
            return [{"text": text, "start_idx": 0}]

        chunks = []
        start = 0

        while start < len(text):
            end = min(start + max_chunk_size, len(text))
            if end < len(text):
                while end > start and text[end] not in ".!?":
                    end -= 1
                if end == start:
                    end = start + max_chunk_size

            chunks.append({"text": text[start:end], "start_idx": start})
            start = end

        return chunks

    def apply_suggestion(
        self, text: str, suggestion: TextSuggestion, improvement_index: int
    ) -> str:
        start, end = suggestion.span
        improvement = suggestion.improvements[improvement_index]
        return text[:start] + improvement.text + text[end:]
