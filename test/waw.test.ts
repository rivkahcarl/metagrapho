import { Text } from "../src/index";

describe.each`
  description                              | hebrew       | transliteration
  ${"consonantal waw"}                     | ${"וָו"}     | ${"βαβ"}
  ${"waw haser (holem precedes waw)"}      | ${"שָׁלֹום"}  | ${"σσαλωμ"}
  ${"shureq"}                              | ${"קוּם"}    | ${"κουμ"}
  ${"initial shureq"}                      | ${"וּלֶחֶם"} | ${"ουλεχεμ"}
  ${"Consonantal vav with holem as vowel"} | ${"עָוֹן"}   | ${"αβων"}
`("Waws:", ({ description, hebrew, transliteration }) => {
  const heb = new Text(hebrew);
  const transliteratedHeb = heb.transliterate();
  test(`${description} to equal: ${transliteration}`, () => {
    expect(transliteratedHeb).toEqual(transliteration);
  });
});
