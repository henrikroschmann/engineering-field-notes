---
title: "{{title}}"
description: "{{theme-summary}}"
date: "{{date}}"
category: "after-hours"
tags: [{{tags}}]
level: "casual"
---

<AfterHoursLayout
  title="{{title}}"
  theme="{{theme}}"
  date="{{date}}"
  :tags="[{{tags}}]"
>

## {{Theme}}

{{theme-intro}}

---

### 1️⃣ {{article-1-title}}

{{article-1-summary}}

**Why it matters:** {{article-1-why}}

<QuoteBlock type="contrarian">
{{article-1-contrarian}}
</QuoteBlock>

**Practical takeaway:** {{article-1-takeaway}}

**Discussion starters:**
{{article-1-discussion}}

<SourceLink url="{{article-1-source-url}}" title="{{article-1-source-title}}" />

---

### 2️⃣ {{article-2-title}}

{{article-2-summary}}

**Why it matters:** {{article-2-why}}

<QuoteBlock type="contrarian">
{{article-2-contrarian}}
</QuoteBlock>

**Practical takeaway:** {{article-2-takeaway}}

**Discussion starters:**
{{article-2-discussion}}

<SourceLink url="{{article-2-source-url}}" title="{{article-2-source-title}}" />

<!-- Repeat pattern for articles 3-N -->

---

## 🏗️ Architecture Smell of the Week

<SmellBadge level="high">

**The smell:** {{smell-description}}

**The risk:** {{smell-risk}}

**The question:** {{smell-question}}

</SmellBadge>

---

## 🥃 Whisky-Grade Take

<QuoteBlock type="takeaway">
{{whisky-take}}
</QuoteBlock>

---

## 🎯 Final Obnoxious Take

> {{obnoxious-take}}

---

<MiniQuiz
  question="{{quiz-question}}"
  :options="[{{quiz-options}}]"
  :answer={{quiz-answer}}
  explanation="{{quiz-explanation}}"
/>

</AfterHoursLayout>
