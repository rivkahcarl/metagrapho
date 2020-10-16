import { Syllable } from "havarotjs/dist/syllable";
import { transliterateMap } from "./hebCharTrans";

const changeElementSplit = (input: string, split: RegExp, join: string) =>
  input.split(split).join(join);

const addAcute = (input: string): string => {
  // using String.matchAll() would be preferred, but it will not have support on older machines
  const vowels = /[αειοωυ]/g;
  let reversed = [...input].reverse().join("");
  const index = reversed.search(vowels);
  if (index !== -1) {
    const acute = "\u{0301}";
    reversed = reversed.slice(0, index) + acute + reversed.slice(index);
  }
  const newStr = [...reversed].reverse().join("");
  return newStr;
};

export const syllableRules = (syl: Syllable): string => {
  let sylTrans: string = "";
  const taamei = /[\u{0590}-\u{05AF},\u{05BD},\u{05BF},\u{05C0},\u{05C3}]/u;
  const sylTxt = syl.text.replace(taamei, "");
  const sylIsFinal = syl.isFinal;
  const sylIsClosed = syl.isClosed;
  let sylHasMater: boolean = false;
  let sylMaterText: string | null = null;
  let isAccented: boolean = syl.isAccented;

  syl.clusters.forEach((cluster) => {
    let clusterTrans = cluster.text;
    clusterTrans = clusterTrans.replace(taamei, "");
    sylHasMater = sylHasMater ? true : cluster.isMater;
    sylMaterText = sylMaterText
      ? sylMaterText
      : sylHasMater
      ? clusterTrans
      : null;
    /******************
     * SPIRANTIZATION
     ******************/
    // bet with dagesh > μπ
    if (/ב\u{05BC}/u.test(clusterTrans)) {
      clusterTrans = changeElementSplit(clusterTrans, /ב\u{05BC}/u, "μπ");
    }

    // gimel with dagesh > γκ
    if (/ג\u{05BC}/u.test(clusterTrans)) {
      clusterTrans = changeElementSplit(clusterTrans, /ג\u{05BC}/u, "γκ");
    }

    // dalet with dagesh > ντ
    if (/ד\u{05BC}/u.test(clusterTrans)) {
      clusterTrans = changeElementSplit(clusterTrans, /ד\u{05BC}/u, "ντ");
    }

    // zayin with dagesh > τζ
    if (/ז\u{05BC}/u.test(clusterTrans)) {
      clusterTrans = changeElementSplit(clusterTrans, /ז\u{05BC}/u, "τζ");
    }

    // kaph with dagesh > κ
    if (/כ\u{05BC}/u.test(clusterTrans)) {
      clusterTrans = changeElementSplit(clusterTrans, /כ\u{05BC}/u, "κ");
    }

    // final kaph with dagesh > κ
    if (/ך\u{05BC}/u.test(clusterTrans)) {
      clusterTrans = changeElementSplit(clusterTrans, /ך\u{05BC}/u, "κ");
    }

    // peh with dagesh > π
    if (/פ\u{05BC}/u.test(clusterTrans)) {
      clusterTrans = changeElementSplit(clusterTrans, /פ\u{05BC}/u, "π");
    }

    // tav with dagesh > τ
    if (/ת\u{05BC}/u.test(clusterTrans)) {
      clusterTrans = changeElementSplit(clusterTrans, /ת\u{05BC}/u, "τ");
    }

    /**********
     * CLEANUP
     **********/
    if (cluster.isShureq) {
      clusterTrans = "ου";
    }

    // shin > sch
    if (/ש\u{05C1}/u.test(clusterTrans)) {
      clusterTrans = changeElementSplit(clusterTrans, /ש\u{05C1}/u, "σσ");
    }

    if (sylIsClosed && cluster.hasShewa) {
      const shewa = /\u{05B0}/u;
      clusterTrans = clusterTrans.replace(shewa, "");
    }

    sylTrans += clusterTrans;
  });

  // 3ms suffix
  if (sylIsFinal && sylIsClosed && !sylHasMater) {
    const threeMSSuffix = /\u{05B8}\u{05D9}\u{05D5}/u;
    const patchYod = /\u{05B7}\u{05D9}/u;
    const qametsYod = /\u{05B8}\u{05D9}/u;
    if (threeMSSuffix.test(sylTxt)) {
      sylTrans = changeElementSplit(sylTxt, threeMSSuffix, "άβ");
      isAccented = false;
    } else if (patchYod.test(sylTxt)) {
      sylTrans = changeElementSplit(sylTxt, patchYod, "άη");
      isAccented = false;
    } else if (qametsYod.test(sylTxt)) {
      sylTrans = changeElementSplit(sylTxt, qametsYod, "άη");
      isAccented = false;
    }
  }

  // furtive chet
  if (sylIsFinal && !sylIsClosed && !sylHasMater) {
    const furtiveChet = /\u{05D7}\u{05B7}/u;
    if (furtiveChet.test(sylTrans)) {
      sylTrans = changeElementSplit(sylTrans, furtiveChet, "\u{05B7}\u{05D7}");
    }
  }

  // final yods
  if (sylIsFinal && sylHasMater) {
    // masc plural ending
    if (sylIsClosed) {
      const pluralSufx = /\u{05B4}\u{05D9}\u{05DD}/u;
      if (pluralSufx.test(sylTrans)) {
        sylTrans = changeElementSplit(sylTrans, pluralSufx, "είμ");
        isAccented = false;
        sylMaterText = null;
      }
    } else {
      const hiriqYod = /\u{05B4}\u{05D9}/u;
      const tsereYod = /\u{05B5}\u{05D9}/u;
      if (hiriqYod.test(sylTrans)) {
        sylTrans = changeElementSplit(sylTrans, hiriqYod, "η");
      } else if (tsereYod.test(sylTrans)) {
        sylTrans = changeElementSplit(sylTrans, tsereYod, "αί");
        isAccented = false;
      }
      sylMaterText = null;
    }
  }

  if (sylMaterText) {
    let materRegx = new RegExp(sylMaterText);
    sylTrans = changeElementSplit(sylTrans, materRegx, "");
  }

  sylTrans = [...sylTrans]
    .map((char) => (char in transliterateMap ? transliterateMap[char] : char))
    .reduce((a, c) => a + c, "");

  // clean up Greek issues
  const doubleIota = /ιι/;
  if (doubleIota.test(sylTrans)) {
    sylTrans = changeElementSplit(sylTrans, doubleIota, "ι");
  }

  sylTrans = isAccented ? addAcute(sylTrans) : sylTrans;
  return sylTrans;
};
