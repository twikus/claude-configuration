# Master Prompt Creation Guide

Essential techniques ranked by effectiveness:

1. **Be clear and direct** - Remove fluff, use plain language
2. **Provide examples** - 3-5 diverse examples show exactly what you want
3. **Enable chain of thought** - Structured thinking improves output quality
4. **Use XML tags** - Claude's native structure for organization
5. **Assign a specific role** - Transform Claude into a domain expert
6. **Control output format** - Specify exactly how you want the response

## The Master Template

```xml
<role>
You are a [specific expert role with context]
</role>

<instructions>
[Clear, specific task description]
[Explain why this matters if complex]
</instructions>

<context>
[Relevant background information]
</context>

<examples>
<example>
Input: [sample input]
Output: [desired output format]
</example>
<!-- Add 2-4 more diverse examples -->
</examples>

<thinking>
Think through this step by step:
1. [First consideration]
2. [Second consideration]
3. [Final decision]
</thinking>

<answer>
[Your response here]
</answer>
```

## Core Principles

**XML Structure**: Claude was trained with XML tags - use them for best results.

**Specific Roles**: Instead of "helpful assistant", use "senior React developer with 5+ years TypeScript experience".

**Examples Work**: 3-5 diverse examples dramatically improve output quality.

## Key Techniques

**Be Explicit**: "Create analytics dashboard with all relevant features. Don't hold back on complexity."

**Explain Why**: Add context about why the task matters for better results.

**Encourage Thoroughness**: Use "Be thorough", "Don't hold back", "Include everything relevant".

## Chain of Thought

**Basic**: "Think step by step before answering."

**Better**: List specific considerations:

```
Before answering, consider:
1. Key constraints
2. Possible approaches
3. Trade-offs
4. Optimal solution
```

**Best**: Use XML structure:

```xml
<thinking>
1. Understanding the problem: [analysis]
2. Available approaches: [options]
3. Constraints and trade-offs: [evaluation]
4. Optimal solution: [decision]
</thinking>

<answer>
[Final response based on reasoning above]
</answer>
```

## Examples (3-5 Diverse Cases)

```xml
<examples>
<example>
Input: "Budget meeting prep"
Output: Priority: High | Category: Work - Planning | Due: Today
</example>

<example>
Input: "Call mom about weekend plans"
Output: Priority: Medium | Category: Personal - Family | Due: This week
</example>

<example>
Input: "Research competitor pricing"
Output: Priority: High | Category: Work - Research | Due: Tomorrow
</example>
</examples>
```

## Common Mistakes

**Vague**: "Analyze this data"
**Specific**: "Analyze sales data to identify top 3 customer churn factors with metrics and recommendations"

**Mixed**: Instructions and examples in same paragraph
**Clean**: Separate with XML tags: `<instructions>` and `<examples>`

**Generic role**: "You are a helpful assistant"
**Powerful role**: "You are a senior data scientist with 8 years experience in customer analytics"

## Instructions

**Clear Task**: Be specific about what you want. "Create analytics dashboard with user authentication, data visualization, and export features."

**Expert Role**: Use detailed expertise. "You are a senior full-stack developer with 8+ years React/TypeScript experience."

**XML Structure**: Organize with `<instructions>`, `<examples>`, `<thinking>`, `<answer>` tags.

**Show Examples**: Include 3-5 diverse input/output examples.

**Add Reasoning**: Use `<thinking>` tags for complex tasks.

## Most Powerful Formula

1. **Expert role**: "You are a [specific expert] with [years] experience in [domain]"
2. **XML structure**: Organize with clear tags
3. **3-5 examples**: Show exactly what you want
4. **Chain of thought**: Add `<thinking>` for complex tasks

This combination gives you maximum prompt effectiveness for any task.
