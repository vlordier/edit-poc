analyze_prompt_template = """You are an experienced medical writer specializing in clinical report studies.
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

Suggestion:"""
