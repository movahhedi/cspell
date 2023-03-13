import { opConcatMap, opFilter, opMap, pipe } from '@cspell/cspell-pipe/sync';

import { regExpSpaceOrDash, splitCamelCaseIfAllowed } from './splitCamelCaseIfAllowed';
import type { AllowedSplitWordsCollection } from './WordsCollection';

const regNonWord = /[^\p{L}\p{M}' \d]+/giu;
const regExpRepeatChars = /(.)\1{5}/i;

export function legacyLineToWords(
    line: string,
    keepCase: boolean,
    allowedSplitWords: AllowedSplitWordsCollection
): Iterable<string> {
    // Remove punctuation and non-letters.
    const filteredLine = line.replace(regNonWord, '|');
    const wordGroups = filteredLine.split('|');

    const words = pipe(
        wordGroups,
        opConcatMap((a) => [...a.split(regExpSpaceOrDash)]),
        opConcatMap((a) => splitCamelCaseIfAllowed(a, allowedSplitWords, keepCase)),
        opMap((a) => a.trim()),
        opFilter((a) => !!a),
        opFilter((s) => !regExpRepeatChars.test(s))
    );

    return words;
}

export function* legacyLinesToWords(
    lines: Iterable<string>,
    keepCase: boolean,
    allowedSplitWords: AllowedSplitWordsCollection
): Iterable<string> {
    for (const line of lines) {
        yield* legacyLineToWords(line, keepCase, allowedSplitWords);
    }
}
