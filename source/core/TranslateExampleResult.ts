import { PARTS_OF_SPEECH } from '../constants/LanguageConstants';

class TranslateExample {
    src?: string;
    dst?: string;

    constructor(src?: string, dst?: string) {
        this.src = src;
        this.dst = dst;
    }
}

export default class TranslateExampleResult {

    original: string;
    pos: string;
    translate: string;
    languageFrom: string;
    languageTo: string;
    examples: TranslateExample[];

    constructor(
        original: string,
        pos: string,
        translate: string,
        langFrom: string,
        langTo: string,
        examples: Partial<TranslateExample>[]
    ) {
        this.original = original;
        this.pos = pos;
        this.translate = translate;
        this.languageFrom = langFrom;
        this.languageTo = langTo;
        this.examples = examples.map((exmp) => new TranslateExample(exmp.src, exmp.dst))
    }
}