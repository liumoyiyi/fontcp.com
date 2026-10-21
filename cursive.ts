// fontcp/src/lib/styles/templates/data/cursive.ts
//
// Cursive group. Two families:
//   - cursive-script: bold math script with crown/star/petal decoration
//     plus peace, star-bow, music and love-emoji frames
//   - cursive-each: per-character symbol wrapping
//
// Every variant in this file carries showOnHome: true because the
// homepage curates the full cursive set. When the group grows past
// roughly 20 styles, only the curated subset should keep this flag;
// new variants default to hidden and surface only on the dedicated
// cursive tool page.

import type { AnyTemplate } from '../types'
import { buildMathMap } from './mapBuilders'

const boldScriptMap = buildMathMap({
  upperBase: 0x1d4d0,
  lowerBase: 0x1d4ea,
})

export const cursive = [
  {
    familyId: 'cursive-script',
    group: 'cursive',
    addedAt: '2026-10-09',
    base: { charMap: boldScriptMap },
    variants: [
      { id: 'plain', label: 'Cursive Plain', showOnHome: true },
      { id: 'crown', label: 'Cursive Crown', showOnHome: true, perCharWrap: { left: '♛', right: '♛' } },
      { id: 'star', label: 'Cursive Star', showOnHome: true, perCharWrap: { left: '✩', right: '✩' } },
      { id: 'petal', label: 'Cursive Petal', showOnHome: true, perCharWrap: { left: '❀', right: '❀' } },
      { id: 'bloom', label: 'Cursive Bloom', showOnHome: true, perCharWrap: { left: '⚘', right: '⚘' } },
      { id: 'swirl', label: 'Cursive Swirl', showOnHome: true, perCharWrap: { left: '୭', right: '୭' } },
      { id: 'frame-star', label: 'Cursive Star Frame', showOnHome: true, frame: { prefix: '✧･ﾟ ', suffix: ' ﾟ･✧' } },
      { id: 'frame-floral', label: 'Cursive Floral Frame', showOnHome: true, frame: { prefix: '꧁✬◦° ', suffix: ' °◦✬꧂' } },
      { id: 'peace', label: 'Peace Cursive', showOnHome: true, frame: { prefix: '✌', suffix: '✌' } },
      {
        id: 'star-bow',
        label: 'Cursive Star Bow',
        showOnHome: true,
        frame: { prefix: '✴.·´¯`·.·★  🎀', suffix: '🎀  ★·.·`¯´·.✴' },
      },
      {
        id: 'music',
        label: 'Music Cursive',
        showOnHome: true,
        frame: { prefix: '¸¸♬·¯·♪·¯·♫¸¸ ', suffix: ' ¸¸♫·¯·♪¸♩·¯·♬¸¸' },
      },
      {
        id: 'love-emoji',
        label: 'Love Emoji Cursive',
        showOnHome: true,
        frame: { prefix: '😍💞💘 ', suffix: ' 💔💏💖' },
      },
    ],
  },
  {
    familyId: 'cursive-each',
    group: 'cursive',
    addedAt: '2026-10-09',
    variants: [
      { id: 'sparkle', label: 'Cursive Sparkle Each',  perCharWrap: { left: '✧', right: '✧' } },
      { id: 'star', label: 'Cursive Star Each', perCharWrap: { left: '⋆', right: '⋆' } },
      { id: 'flower', label: 'Cursive Flower Each',  perCharWrap: { left: '✿', right: '✿' } },
      { id: 'heart', label: 'Cursive Heart Each',  perCharWrap: { left: '♡', right: '♡' } },
      { id: 'diamond', label: 'Cursive Diamond Each', perCharWrap: { left: '◈', right: '◈' } },
      { id: 'moon', label: 'Cursive Moon Each', perCharWrap: { left: '☾', right: '☽' } },
      { id: 'leaf', label: 'Cursive Leaf Each',  perCharWrap: { left: '❧', right: '❧' } },
      { id: 'dot', label: 'Cursive Dot Each',  perCharWrap: { left: '·', right: '·' } },
      { id: 'slash', label: 'Cursive Slash Each',  perCharWrap: { left: '/', right: '\\' } },
    ],
  },
] satisfies readonly AnyTemplate[]