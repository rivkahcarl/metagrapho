import { Text } from "../src/index";

describe.each`
  description                   | hebrew           | transliteration
  ${"1 syl, accent on first"}   | ${"לָ֔ךְ"}       | ${"λάχ"}
  ${"2 syls, accent on first"}  | ${"לֶ֬חֶם"}      | ${"λέχεμ"}
  ${"2 syls, accent on last"}   | ${"דָּבָ֑ר"}     | ${"νταβάρ"}
  ${"3 syls, accent on last"}   | ${"אֲרַנֵּ֥ן"}   | ${"αρανέν"}
  ${"3 syls, accent on second"} | ${"הִגַּ֣דְתָּ"} | ${"ιγκάδτα"}
`("Accents:", ({ description, hebrew, transliteration }) => {
  const heb = new Text(hebrew);
  const transliteratedHeb = heb.transliterate();
  test(`${description} to equal: ${transliteration}`, () => {
    expect(transliteratedHeb).toEqual(transliteration);
  });
});
