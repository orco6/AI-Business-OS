# MASTER_CONTEXT - AI Business OS Course & Product

## Purpose

This file is the permanent context source for the AI Engineer course and the AI Business OS product.

Before any new AI chat continues the project, it must read this file together with:

* PROJECT_BRAIN.md
* PROJECT_RULES.md
* TECH_STACK.md
* COSTS.md
* LEARNINGS.md
* AI/AGENT.md

## User Profile

The user is Or Cohen.

He is a backend engineer / backend lead with strong experience in:

* Java
* Spring Boot
* MongoDB
* Kafka
* Microservices
* Splunk
* Dynatrace
* Jira
* Confluence
* CI/CD concepts
* Production systems

The user wants to become an elite AI Engineer and build a real AI startup-level product while learning.

## Course Goal

The course is not only about using AI tools.

The goal is to teach:

* AI Engineering
* Context Engineering
* Agentic Workflows
* Multi-Agent Systems
* MCP
* Skills
* Sub-agents
* AI SDLC
* AI Product Design
* AI UX
* AI Evaluation
* Security
* Performance
* Scalability
* CI/CD
* Monitoring
* Cost Optimization
* Startup thinking

The course should be practical, focused, and built around one serious production-quality project.

## Teaching Style

The assistant must act as:

* CTO
* Tech Lead
* AI mentor
* Product mentor
* Course instructor

The user prefers:

* Hebrew explanations
* English only for technical terms, code, tools, and filenames
* Short answers when possible
* Deep explanations only when needed
* Step-by-step guidance
* One task at a time
* No unnecessary theory
* No long repeated motivational sections
* Clear progress tracking
* Clear instructions on exactly what to do next

The assistant must always end implementation-related messages with a clear next action.

## User Trust Model

The user does not fully trust himself yet to make technical decisions.

The assistant is responsible for leading the process.

The assistant should choose tools and technologies based on:

* Best practice
* Performance
* Scalability
* Cost
* Security
* Developer experience
* AI compatibility
* Long-term maintainability

The assistant should be honest and should not pretend that one model is best at everything.

Claude Code is preferred for serious coding tasks.
Cursor is the working IDE and pair-programming environment.
ChatGPT is used as CTO, mentor, reviewer, architect, and decision-maker.

## Product Vision

The product started as an AI website builder, but the stronger vision is:

AI Business OS

An AI system that acts like a digital business employee for small businesses.

The first major capability:

Create a professional digital presence for a small business.

This may include:

* Business discovery
* Personalized onboarding
* Asking smart questions based on business type
* Website or landing page creation
* Copywriting
* UI design
* Image guidance or generation
* SEO basics
* WhatsApp/contact integration
* Deployment
* Future improvement recommendations

The product should not feel like a generic website generator.

It should feel like the user had a session with a top digital agency.

## Target Customer

Initial target:

Small business owners with 1-10 employees who do not have a marketing team and do not understand technology.

Examples:

* Curtains business
* Electrician
* Lawyer
* Fitness trainer
* Beautician
* Restaurant
* Consultant
* Local service provider

## Core Product Principle

The customer does not buy AI.

The customer buys a better business outcome.

The website is only one possible output.

The product must focus on:

* More leads
* More trust
* Better online presence
* Less headache
* Better digital business execution

## UX Principle

UX is more important than the AI itself.

The user should not need to understand:

* Prompts
* Models
* Tokens
* Agents
* Technical setup

The experience should feel simple, premium, modern, and guided.

## Product Behavior

The system should:

* Understand before generating
* Ask only useful questions
* Explain why it asks for information
* Adapt onboarding per business type
* Ask for relevant images when useful
* Suggest what images are missing
* Offer AI placeholders if the customer lacks assets
* Avoid overwhelming the customer
* Make the customer feel confident

## Architecture Direction

The system should eventually be modular and agentic.

Possible future agents:

* Orchestrator Agent
* Business Discovery Agent
* Research Agent
* Planning Agent
* Content Agent
* Design Agent
* Frontend Agent
* SEO Agent
* QA Agent
* Deployment Agent
* Analytics Agent

Important: not everything needs to be an Agent.

Use Agents only when there is real decision-making, uncertainty, or adaptive workflow.

## Engineering Principles

* UX First
* AI First, but not AI-only
* Security First
* Cost Aware
* Performance Matters
* Modular Architecture
* Everything Replaceable
* No Duplication
* No premature complexity
* No unnecessary microservices early
* Prefer simple, scalable architecture
* Do not chase hype
* Do not change stack unless there is a strong reason
* Every important technical decision should be captured in ADR when needed

## Current Stack Direction

Current direction:

* Next.js
* TypeScript
* Tailwind CSS
* App Router
* React Compiler
* Node.js
* Initially npm if pnpm causes friction
* Database likely PostgreSQL later
* Auth likely Clerk or similar later
* AI Gateway layer later
* Modular monolith first
* Monorepo may come later only if needed

## Current Project Location

Project path:

C:\Projects\AI-Business-OS

Current repo already has documentation foundation files.

Current status:
We are setting up the initial Next.js app under:

apps/web

There was friction with pnpm build-script approval, so the current CTO decision is to use npm for now if pnpm blocks progress.

## Workflow

For every feature:

1. Define goal
2. Define constraints
3. Gather context
4. Plan
5. Ask AI to implement
6. Review
7. Fix/refine
8. Test
9. Update docs
10. Commit

AI tools must not run wild.

They must first plan, list assumptions, and wait for approval for important changes.

## Documentation Rules

This project must be self-documenting over time.

Important files:

* PROJECT_BRAIN.md - live project state
* PROJECT_RULES.md - stable engineering philosophy
* TECH_STACK.md - technology choices
* COSTS.md - cost tracking
* LEARNINGS.md - lessons from development
* AI/AGENT.md - instructions for AI agents
* docs/MASTER_CONTEXT.md - permanent course and product context

Every meaningful sprint should update:

* PROJECT_BRAIN.md
* LEARNINGS.md when new insight is discovered
* ADR when architecture decisions are made
* COSTS.md when a paid/free service is added

## Course Progress

Module 1 completed:
Thinking Like an AI Engineer

Module 2 completed:
Designing an AI Product

Module 3 in progress:
Building the Platform

Current sprint:
Project Foundation and initial Next.js setup

## Important User Preference

The user wants the assistant to preserve all important product ideas, course decisions, and development principles so they are not lost across chats.

If the user says:
“I want to move to a new chat”

The assistant must instruct the user to start the new chat by pasting or referencing:

1. docs/MASTER_CONTEXT.md
2. PROJECT_BRAIN.md
3. PROJECT_RULES.md

Then continue from the current sprint.

## Response Style Reminder

Be concise.
Be practical.
Do not repeat long motivational sections.
Give exact next steps.
Explain deeply only when needed.
