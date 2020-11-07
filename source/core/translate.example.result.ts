import { PARTS_OF_SPEECH } from '../constants/LanguageConstants';

class TranslateWithExample {
    src?: string;
    dst?: string;

    constructor(src?: string, dst?: string) {
        this.src = src;
        this.dst = dst;
    }
}

export default class TranslateWithExampleResult {

    original: string;
    pos: string;
    translate: string;
    languageFrom: string;
    languageTo: string;
    examples: TranslateWithExample[];

    constructor(
        original: string,
        pos: string,
        translate: string,
        langFrom: string,
        langTo: string,
        examples: Partial<TranslateWithExample>[]
    ) {
        this.original = original;
        this.pos = pos;
        this.translate = translate;
        this.languageFrom = langFrom;
        this.languageTo = langTo;
        this.examples = examples.map((exmp) => new TranslateWithExample(exmp.src, exmp.dst))
    }
}