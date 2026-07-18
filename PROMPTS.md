# PROMPTS.md — AI Description Generator (Week 7)

## Feature
`POST /api/ai/generate-description` — generates a marketing description for a food
product using Hugging Face Inference Providers (`openai/gpt-oss-120b:cerebras`),
based on the product's name, ingredients, weight, key features, and a selected tone.

## System / Base Prompt Template

```
Write a compelling product description for a food product, in a {tone} tone.

Product name: {name}
Key ingredients: {ingredients}
Weight/size: {weight}
Key features: {features}

Write 2-3 sentences. Do not include the product name as a heading, just the
description text.
```

The only variable tested across variations was **tone**, since that is the
user-facing control exposed in the FoodPro UI (Premium / Traditional /
Health-Focused). Product input for all three tests:

- **Name:** Moringa Leaves
- **Ingredients:** 100% Organic Moringa Leaves
- **Weight:** 250g
- **Features:** Rich in vitamins and minerals; Vegan and gluten-free; Sustainably sourced

---

## Variation 1 — Tone: Health-Focused

**Output:**
> Packed with 100% organic Moringa leaves, this 250g bundle delivers a natural
> burst of vitamins, minerals, and antioxidants to support immune health and
> energy levels. Perfect for vegans and those with gluten sensitivities, it's
> sustainably sourced to nurture both your body and the planet. Enjoy the
> vibrant, earthy flavor while harnessing nature's most powerful superfood.

**Notes:** Leads with functional/nutritional benefits (immune health, energy).
Direct, benefit-first language aimed at a wellness-conscious buyer.

---

## Variation 2 — Tone: Traditional

**Output:**
> Harvested from pristine, organic farms, these 250g packets of pure Moringa
> leaves deliver a bounty of vitamins and minerals to support wholesome living.
> Certified vegan and gluten-free, each leaf is cultivated with reverence for
> the earth, ensuring a sustainably sourced treasure for the discerning palate.

**Notes:** Heritage and provenance-focused language ("pristine, organic farms,"
"reverence for the earth"). Slower, more reflective pacing than the
Health-Focused version.

---

## Variation 3 — Tone: Premium

**Output:**
> Elevate your daily nutrition with 250g of 100% organic Moringa leaves, a
> verdant powerhouse brimming with essential vitamins, minerals, and
> antioxidants. Expertly harvested from sustainable farms, these vegan- and
> gluten-free leaves deliver the pure, earth-derived vitality of the
> "miracle tree" without compromise. Indulge in nature's most refined
> superfood, responsibly sourced for a cleaner, greener you.

**Notes:** Aspirational, elevated vocabulary ("verdant powerhouse," "miracle
tree," "indulge"). Positions the product as a lifestyle upgrade rather than
a functional health product.

---

## Which Worked Best and Why

The **Health-Focused** variation worked best for FoodPro's use case. It
communicates concrete, specific benefits (immune health, energy, vitamins,
antioxidants) rather than relying on abstract or purely emotive language, which
matters more to a shopper deciding whether to buy a food product. The
Traditional and Premium variations produced polished copy, but leaned more on
tone/mood than on information the buyer actually needs to make a purchase
decision. For a product-description generator specifically, prioritizing
clarity and concrete claims over stylistic flourish produced the more useful
output.

## Error Handling

If the Hugging Face API call fails or times out, the backend catches the
exception and returns a `503 Service Unavailable` with a descriptive error
message, rather than crashing the request or returning a malformed response.
The frontend shows an error toast ("Failed to generate description. Please
try again.") if the request fails, and a loading spinner ("AI is writing...")
while the request is in progress.
