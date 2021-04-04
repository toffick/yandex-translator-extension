interface MousePosition {
  X: number;
  Y: number;
}

interface Translation {
  original: string;
  translation: string;
}

export interface TooltipData {
  mousePosition: MousePosition;
  translation: Translation;
}
