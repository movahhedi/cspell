export interface ParsedText {
    /**
     * The text extracted and possibly transformed
     */
    text: string;
    /**
     * [start, end] - offsets of the text
     */
    range: Range;
    /**
     * The source map is used to support text transformations.
     *
     * See: {@link SourceMap}
     */
    map?: SourceMap;
    /**
     * Used to delegate parsing the contents of `text` to another parser.
     *
     */
    delegate?: DelegateInfo;
}

export interface TextSegment {
    /**
     * Extracted text
     */
    text: string;
    /**
     * [start, end] - offsets of the text
     */
    range: Range;
}

/**
 * A SourceMap is used to map transform a piece of text back to its original text.
 * This is necessary in order to report the correct location of a spelling issue.
 * An empty source map indicates that it was a 1:1 transformation.
 *
 * The values in a source map are number pairs (even, odd) relative to the beginning of each
 * string segment.
 * - even - offset in the source text
 * - odd - offset in the transformed text
 *
 * Offsets start a 0
 *
 * Example:
 *
 * - Original text: `Grand Caf\u00e9 Bj\u00f8rvika`
 * - Transformed text: `Grand Café Bjørvika`
 * - Map: [9, 9, 15, 10, 18, 13, 24, 14]
 *
 * | offset | original    | offset | transformed |
 * | ------ | ----------- | ------ | ----------- |
 * | 0-9    | `Grand Caf` | 0-9    | `Grand Caf` |
 * | 9-15   | `\u00e9`    | 9-10   | `é`         |
 * | 15-18  | ` Bj`       | 10-13  | ` Bj`       |
 * | 18-24  | `\u00f8`    | 13-14  | `ø`         |
 * | 24-29  | `rvika`     | 14-19  | `rvika`     |
 *
 * <!--- cspell:ignore Bjørvika rvika --->
 */
export type SourceMap = number[];

/**
 * start and end offset of a segment of text
 */
export type Range = [start: number, end: number];

/**
 * DelegateInfo is used by a parser to delegate parsing a subsection of a document to
 * another parser. The following information is used by the spell checker to match
 * the parser.
 */
export interface DelegateInfo {
    /**
     * Proposed virtual file name including the extension.
     * Format: `./${source_filename}/${block_number}.${ext}
     * Example: `./README.md/1.js`
     */
    filename: string;
    /**
     * The filename of the origin of the virtual file block.
     * Example: `./README.md`
     */
    originFilename: string;
    /**
     * Proposed file extension
     * Example: `.js`
     */
    extension: string;
    /**
     * Filetype to use
     * Example: `javascript`
     */
    fileType: string;
}
