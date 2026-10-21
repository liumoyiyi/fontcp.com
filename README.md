# Unicode Text Styles

Template data for copy-and-paste text styling: which Unicode codepoint replaces
which ASCII letter, and what decoration goes around it. TypeScript source, no
build step, no runtime dependencies.

This is the styling layer behind [FontCP](https://fontcp.com/), a free
copy-and-paste font tool. It is published because the interesting part of this
problem is not the codepoint tables — those are in the Unicode spec — but the
composition rules: how a per-character wrap differs from a whole-string frame,
and what each one does to a character counter.

There are no font files here. Nothing is installed. A "copy and paste font" is
a substitution table: plain `A` becomes `𝓐` (U+1D4D0, MATHEMATICAL BOLD SCRIPT
CAPITAL A), and the receiving app renders whichever glyph its own system font
has for that codepoint.

---

## Status

One group is included as a worked example: `cursive`, with two families and
21 variants. The schema below is what the rest of the template set follows.

---

## Template shape

```ts
import type { AnyTemplate } from '../types'
import { buildMathMap } from './mapBuilders'

const boldScriptMap = buildMathMap({
  upperBase: 0x1D4D0,   // MATHEMATICAL BOLD SCRIPT CAPITAL A
  lowerBase: 0x1D4EA,   // MATHEMATICAL BOLD SCRIPT SMALL A
})

export const cursive = [
  {
    familyId: 'cursive-script',
    group: 'cursive',
    addedAt: '2026-10-09',
    base: { charMap: boldScriptMap },
    variants: [
      { id: 'plain', label: 'Cursive Plain', showOnHome: true },
      { id: 'crown', label: 'Cursive Crown', showOnHome: true,
        perCharWrap: { left: '♛', right: '♛' } },
      { id: 'frame-floral', label: 'Cursive Floral Frame', showOnHome: true,
        frame: { prefix: '꧁✬◦° ', suffix: ' °◦✬꧂' } },
    ],
  },
] satisfies readonly AnyTemplate[]
```

### Fields

| Field | Type | Required | Meaning |
|---|---|---|---|
| `familyId` | `string` | yes | Stable slug. **Unique only within a group** — combine with `group` for a global key |
| `group` | `string` | yes | UI section this family belongs to (homepage block, tool page). Several families can share one group |
| `addedAt` | `YYYY-MM-DD` | yes | When the family entered the set. Used for freshness signals and changelogs |
| `base.charMap` | lookup | no | Plain char → styled char. **Omit it and the family only adds decoration** (see `cursive-each`) |
| `variants` | array | yes | The actual styles. Each is one output |
| `variants[].id` | `string` | yes | Slug, unique within the family — **not across the group** |
| `variants[].label` | `string` | yes | Display name |
| `variants[].showOnHome` | `boolean` | no | Defaults to `false`. The homepage shows a curated subset, not everything |
| `variants[].perCharWrap` | `{ left, right }` | no | Wrap **each character** individually |
| `variants[].frame` | `{ prefix, suffix }` | no | Wrap **the whole string** once |

`perCharWrap` and `frame` are mutually exclusive. There is no case in the data
where both apply, and the renderer should treat that as invalid input.

---

## The two decoration strategies

This is the only genuinely non-obvious part of the schema.

**`perCharWrap`** — insert `left` before and `right` after every character:

```
input:    hey
styled:   𝓱𝓮𝔂
wrapped:  ✧𝓱✧✧𝓮✧✧𝔂✧
```

**`frame`** — insert `prefix` once at the start, `suffix` once at the end:

```
input:    hey
styled:   𝓱𝓮𝔂
framed:   ꧁✬◦° 𝓱𝓮𝔂 °◦✬꧂
```

They are not interchangeable. A per-character wrap multiplies the character
count by roughly the length of the decoration, so it collapses under any hard
limit. A frame adds a fixed cost no matter how long the input is.

Typical decoration sizes in this set:

| Variant | Strategy | Added characters |
|---|---|---|
| `dot` | perCharWrap | +1 per char |
| `crown` | perCharWrap | +2 per char |
| `frame-floral` | frame | +14 total |
| `star-bow` | frame | +40 total |
| `love-emoji` | frame | +8 codepoints, but emoji |

---

## Order of operations

Two stages, in this order:

```ts
function render(template, variant, input, { wrapSpaces = false } = {}) {
  // 1. substitute, if the family has a base map
  const map = template.base?.charMap
  let out = map
    ? [...input].map(c => map.get(c) ?? c).join('')
    : input

  // 2. decorate
  if (variant.perCharWrap) {
    const { left, right } = variant.perCharWrap
    out = [...out]
      .map(c => (!wrapSpaces && c === ' ' ? c : left + c + right))
      .join('')
  } else if (variant.frame) {
    out = variant.frame.prefix + out + variant.frame.suffix
  }

  return out
}
```

Two things the data does **not** specify, so the renderer has to decide and
document them:

1. **Whether spaces get wrapped.** `perCharWrap` on `hello world` can produce
   `✧𝓱✧…✧ ✧𝔀✧…` with a bare space in the middle, or a wrapped one. Pick one.
2. **What happens to characters absent from `charMap`.** The example above
   passes them through unchanged, which means mixed input degrades
   gracefully — `hey123` gives `𝓱𝓮𝔂123` — rather than half-converting.

(If `charMap` is a plain object rather than a `Map`, swap `.get(c)` for `[c]`.)

---

## Families without a base map

`cursive-each` has no `base` field. Its nine variants wrap the **plain**
characters with symbols and never touch the alphabet:

```ts
{ id: 'heart', label: 'Cursive Heart Each', perCharWrap: { left: '♡', right: '♡' } }
// hey → ♡h♡♡e♡♡y♡
```

This is deliberate and valid — but note the naming consequence: a family filed
under `group: 'cursive'` that emits plain, non-cursive letters will look wrong
under a "Cursive" heading in the UI. Either give it its own group, or rename
the labels. The schema allows it; the information architecture does not.

---

---

## Hosted version

The same template data renders at **[fontcp.com](https://fontcp.com/)** — free,
no sign-up, no ads.

Cursive is the one group written up in this repository. The hosted tool covers
17 style groups, and each one carries a note on how its characters behave on
Instagram, TikTok, Discord and in game handles — where they render, where a
platform replaces them, and where a character counter will truncate mid-word.
Those notes are the part that took the longest to get right, and they are not
encoded in the data above.

If you want to copy a styled name rather than read a TypeScript file, that is
the place.

Coverage additions and fallback corrections are welcome as issues or PRs.
