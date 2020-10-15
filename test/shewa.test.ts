import { Text } from "../src/index";

describe.each`
  description           | hebrew         | transliteration
  ${"vocal shewa"}      | ${"סְלִק"}     | ${"σελικ"}
  ${"silent shewa"}     | ${"סַלְכָה"}   | ${"σαλχα"}
  ${"final shewa"}      | ${"כָּךְ"}     | ${"καχ"}
  ${"two final shewas"} | ${"קָטַלְתְּ"} | ${"καταλτ"}
`("Shewas:", ({ description, hebrew, transliteration }) => {
  const heb = new Text(hebrew);
  const transliteratedHeb = heb.transliterate();
  test(`${description} to equal: ${transliteration}`, () => {
    expect(transliteratedHeb).toEqual(transliteration);
  });
});
