# Code Quality Metrics

Quantitative measures for code review decisions.

## Cognitive Complexity

**What it measures**: Mental effort required to understand code

**Targets:**
- Per function: <15 (ideal <10)
- Per module: <50
- Per file: <100

**Factors that increase complexity:**
- Each nesting level (+1 per level)
- Logical operators (&&, ||)
- Recursion
- Breaks in linear flow (break, continue, goto)

**Reduction strategies:**
```javascript
// HIGH COMPLEXITY (nested conditionals)
function process(data) {
  if (data) {
    if (data.valid) {
      if (data.items.length > 0) {
        for (const item of data.items) {
          if (item.active) {
            // process
          }
        }
      }
    }
  }
}

// LOW COMPLEXITY (guard clauses + extraction)
function process(data) {
  if (!data?.valid) return;
  if (!data.items?.length) return;

  processActiveItems(data.items);
}

function processActiveItems(items) {
  const active = items.filter(item => item.active);
  active.forEach(processItem);
}
```

## Cyclomatic Complexity

**What it measures**: Number of independent paths through code

**Formula**: 1 + (if + while + for + case + catch + && + ||)

**Targets:**
| Score | Risk | Action |
|-------|------|--------|
| 1-4 | Low | Good |
| 5-7 | Moderate | Consider simplifying |
| 8-10 | High | Refactor recommended |
| >10 | Very High | Must refactor |

## Function Size Metrics

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| Lines | <20 | >30 | >50 |
| Parameters | ≤3 | 4 | >5 |
| Nesting depth | ≤2 | 3 | >3 |
| Return statements | 1-2 | 3-4 | >4 |

## Maintainability Index

**Formula (Microsoft):**
```
MI = MAX(0, (171 - 5.2*ln(HalsteadVolume) - 0.23*CC - 16.2*ln(LOC)) * 100/171)
```

**Interpretation:**
| Score | Maintainability |
|-------|-----------------|
| 80-100 | High - easy to maintain |
| 60-79 | Moderate - some concerns |
| 40-59 | Low - refactoring recommended |
| <40 | Very Low - significant refactoring needed |

## Technical Debt Indicators

| Indicator | Healthy | Warning |
|-----------|---------|---------|
| Code duplication | <5% | >10% |
| Test coverage | >80% | <60% |
| Cyclomatic complexity avg | <5 | >8 |
| TODO/FIXME count | Stable | Growing |
| Dependency age | <6 months | >12 months |

## Code Churn

**What it measures**: Frequency of code changes

**Warning signs:**
- Same file changed in >50% of recent commits
- High churn + low test coverage = risk
- Late-project churn indicates instability

## When to Flag in Review

### Must Comment
- Function complexity >15
- Nesting >3 levels
- Function >50 lines
- >3 parameters without object

### Consider Commenting
- Duplicated blocks >10 lines
- Method doing multiple things
- Unclear naming

### Don't Comment
- Slightly suboptimal but working code
- Style preferences
- Minor naming improvements

## Tools for Measurement

| Language | Tool |
|----------|------|
| JavaScript/TypeScript | ESLint (complexity rules), SonarQube |
| Python | Radon, Pylint |
| Java | SonarQube, PMD |
| Go | gocyclo, golangci-lint |
| General | SonarQube, CodeClimate |

## Sources
- [SonarQube Cognitive Complexity](https://www.sonarsource.com/docs/CognitiveComplexity.pdf)
- [Microsoft Maintainability Index](https://learn.microsoft.com/en-us/visualstudio/code-quality/code-metrics-maintainability-index-range-and-meaning)
- [Cyclomatic Complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity)
