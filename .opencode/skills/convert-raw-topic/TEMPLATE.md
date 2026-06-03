---
title: "{{title}}"
description: "{{description}}"
date: "{{date}}"
category: "{{category}}"
tags: [{{tags}}]
level: "{{level}}"
---

<TopicLayout
  title="{{title}}"
  subtitle="{{subtitle}}"
  category="{{Category Title}}"
  level="{{Level}}"
  :tags="[{{tags}}]"
  takeaway="{{takeaway}}"
>

## The False Abstraction

{{false-abstraction}}

## What Actually Happens Underneath

{{what-happens-underneath}}

## Minimal Example

{{minimal-example}}

<!-- Interactive components injected here based on topic -->

## Why This Matters

{{why-this-matters}}

## Failure Modes

{{failure-modes}}

## Sharp Takeaway

{{sharp-takeaway}}

## Rabbit Holes

{{rabbit-holes}}

<MiniQuiz
  question="{{quiz-question}}"
  :options="[{{quiz-options}}]"
  :answer={{quiz-answer}}
  explanation="{{quiz-explanation}}"
/>

</TopicLayout>
