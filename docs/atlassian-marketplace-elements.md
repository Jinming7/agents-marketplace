# Atlassian Marketplace Reference Capture (2026-02-25)

Captured via `agent-browser` from:
- Home: https://marketplace.atlassian.com/
- Search list: https://marketplace.atlassian.com/search?product=jira&hosting=cloud
- App detail: https://marketplace.atlassian.com/apps/1210933/draw-io-diagrams-uml-bpmn-aws-erd-flowcharts?hosting=cloud&tab=overview

## Home page key elements
- Global header: logo, primary nav (Apps for products / Categories / Resources / Regulated sectors), support/sign-in
- Hero search box: "Search for apps within Marketplace"
- Featured carousel with prev/next controls and category cards
- Sectioned rails: Cloud Fortified / Spotlight / Bestseller / Rising Star
- App cards include: title, vendor, partner tier, summary, rating, review count, installs, badges
- Footer policy and resource links

## Search results key elements
- Breadcrumb-like nav to Marketplace / Search
- Filter chips: product, hosting, pricing, trust signals, show more filters, clear filters
- Result cards with badges and metadata
- Pagination controls with many pages

## App detail page key elements
- Header actions: Try it free / more actions
- Trust and quality badges
- Tabs: Overview / Reviews / Pricing / Privacy & Security / Support / Installation
- Rich overview content modules and CTA links

## Design/UX patterns worth borrowing (lightweight, no heavy rewrite)
1. Keep strong search + filter controls visible near list context.
2. Unify card metadata hierarchy: app name → vendor → summary → trust badges → rating/install.
3. Add badge semantics and consistent iconography for trust signals.
4. Improve list readability with tighter spacing + section labels.
5. Improve install formatting and accessibility labels.
