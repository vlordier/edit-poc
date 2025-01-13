import logging
from typing import Any, Dict, List

from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import PromptTemplate
from langchain_core.runnables import RunnableSequence

from ..api.models import TextSuggestion
from .prompts import analyze_prompt_template

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TextAnalyzer:
    """
    A class to analyze text and provide suggestions for improvements.
    """

    def __init__(self, llm: Any) -> None:
        """
        Initialize the TextAnalyzer with a language model.

        :param llm: A language model instance.
        """
        self.llm = llm
        self.setup_chains()

    def setup_chains(self) -> None:
        """
        Set up the processing chains for text analysis.
        """
        self.parser = PydanticOutputParser(pydantic_object=TextSuggestion)

        analyze_prompt = PromptTemplate(
            template=analyze_prompt_template,
            input_variables=["text"],
            partial_variables={
                "format_instructions": self.parser.get_format_instructions()
            },
        )

        self.analyze_chain = RunnableSequence(analyze_prompt, self.llm, self.parser)

    async def analyze_text(self, text: str) -> List[TextSuggestion]:
        """
        Analyze the given text and return a list of text suggestions.

        :param text: The text to analyze.
        :return: A list of TextSuggestion objects.
        """
        suggestions: List[TextSuggestion] = []
        text_chunks = self._split_text(text)

        for chunk in text_chunks:
            try:
                result = await self.analyze_chain.ainvoke(input=chunk["text"])
                result.span = (
                    result.span[0] + chunk["start_idx"],
                    result.span[1] + chunk["start_idx"],
                )
                suggestions.append(result)
            except Exception as e:
                logger.error(f"Error analyzing text chunk: {e}")

        return suggestions

    def _split_text(
        self, text: str, max_chunk_size: int = 1000
    ) -> List[Dict[str, Any]]:
        """
        Split the text into manageable chunks for analysis.

        :param text: The text to split.
        :param max_chunk_size: The maximum size of each text chunk.
        :return: A list of text chunks with their start indices.
        """
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
        """
        Apply a specific improvement suggestion to the text.

        :param text: The original text.
        :param suggestion: The TextSuggestion object containing improvements.
        :param improvement_index: The index of the improvement to apply.
        :return: The text with the applied improvement.
        """
        start, end = suggestion.span
        improvement = suggestion.improvements[improvement_index]
        return text[:start] + improvement.text + text[end:]
