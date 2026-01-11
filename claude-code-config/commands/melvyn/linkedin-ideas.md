---
name: linkedin-ideas
description: Generate LinkedIn post ideas with hooks and structure based on a topic
argument-hint: [topic or subject area]
---

<objective>
Generate creative and engaging LinkedIn post ideas for the topic: "#$ARGUMENTS"

This command helps you create high-quality LinkedIn content by:

- Researching current trends and discussions around your topic
- Providing proven hooks and opening lines
- Suggesting post structures and angles
- Identifying engaging content formats
  </objective>

<context>
The command will research:
- Current trends and discussions about "#$ARGUMENTS" on LinkedIn and the web
- Popular post formats and engagement patterns
- Relevant hooks and storytelling angles
- Best practices for LinkedIn content in this niche
</context>

<process>
1. **Launch parallel research agents** to gather context:
   - Use websearch agent to find trending discussions about "#$ARGUMENTS"
   - Research successful LinkedIn posts in this topic area
   - Identify current pain points and interests of the target audience

2. **Analyze research findings** to identify:
   - Top 3-5 angles or perspectives on the topic
   - Proven hook formulas that work for this subject
   - Content formats (story, list, how-to, opinion, case study)
   - Key insights or contrarian takes

3. **Generate 5-7 post ideas** with:
   - Compelling hook (first line that stops the scroll)
   - Post angle and key message
   - Suggested structure (3-5 bullet points)
   - Content format recommendation
   - Target audience and why it resonates

4. **Provide additional resources**:
   - Related hashtags
   - Potential call-to-actions
   - Engagement tips specific to each idea
     </process>

<success_criteria>

- 5-7 diverse and creative post ideas generated
- Each idea includes a strong hook
- Clear structure and format for each post
- Ideas are based on current trends and research
- Different angles covered (not repetitive)
- Actionable and ready to develop into full posts
  </success_criteria>

<output>
Present ideas in this format:

**Idea #1: [Title/Theme]**

- **Hook:** "[Opening line that stops the scroll]"
- **Angle:** [Unique perspective or approach]
- **Structure:**
  1. [Point 1]
  2. [Point 2]
  3. [Point 3]
- **Format:** [Story/List/How-to/Opinion/Case Study]
- **Why it works:** [Reasoning]

[Repeat for each idea]

**Additional Resources:**

- Suggested hashtags: #hashtag1 #hashtag2 #hashtag3
- Engagement tips: [Specific recommendations]
  </output>
