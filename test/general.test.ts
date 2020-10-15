import { Text } from "../src/index";

describe.each`
  description               | hebrew       | transliteration
  ${"no special features"}  | ${"לֶחֶם"}   | ${"λεχεμ"}
  ${"gemination"}           | ${"רַנֵּן"}  | ${"ρανεν"}
  ${"divine name"}          | ${"יְהוָ֣ה"} | ${"Αδωνάη"}
  ${"furtive patach, chet"} | ${"שָׂמֵחַ"}  | ${"σαμεαχ"}
  ${"furtive patach, ayin"} | ${"שָׁמֵעַ"} | ${"σσαμεα"}
  ${"furtive patach, he"}   | ${"גָבֹהַּ"} | ${"γαβωα"}
`("General Rules:", ({ description, hebrew, transliteration }) => {
  const heb = new Text(hebrew);
  const transliteratedHeb = heb.transliterate();
  test(`${description} to equal: ${transliteration}`, () => {
    expect(transliteratedHeb).toEqual(transliteration);
  });
});
/**
 * 
  
  
  
  ${"final chet w/ patach, NOT furtive"} | ${"מִתַּ֣חַת"}   | ${"mitachat"}
  ${"final qamets-he"}                   | ${"מַלְכָּה"}    | ${"malka"}
  
  ${"3ms suffix"}                        | ${"תֹּורֹתָֽיו"} | ${"torotaw"}
   */
