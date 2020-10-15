import { Text } from "havarotjs";
import { Word } from "havarotjs/dist/word";
import { Syllable } from "havarotjs/dist/syllable";
import { syllableRules } from "./rules";

// AUGMENT CLASSES
declare module "havarotjs/dist/syllable" {
  interface Syllable {
    transliterate(): string;
  }
}

Syllable.prototype.transliterate = function (): string {
  let transliteration = this.text;
  transliteration = syllableRules(this);
  return transliteration;
};

declare module "havarotjs/dist/word" {
  interface Word {
    transliterate(): string;
  }
}

Word.prototype.transliterate = function (): string {
  if (this.isDivineName) {
    return "Αδωνάη";
  }
  const transliteratedArr = this.syllables.map((syl) => syl.transliterate());
  const transliteration = transliteratedArr.reduce((a, c) => a + c, "");
  return transliteration;
};

declare module "havarotjs/dist/text" {
  interface Text {
    transliterate(): string;
  }
}

Text.prototype.transliterate = function (): string {
  const transliterationArr = this.words.map((word) => {
    return `${word.whiteSpaceBefore}${word.transliterate()}${
      word.whiteSpaceAfter
    }`;
  });
  const transliteration = transliterationArr.reduce((a, c) => a + c, "");
  return transliteration;
};

export { Text };
