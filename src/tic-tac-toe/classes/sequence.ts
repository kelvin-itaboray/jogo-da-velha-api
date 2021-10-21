import { Mark } from '../enums/mark.enum';

export class Sequence {
  _marks: Mark[];
  _startOffset: number;
  _nextValueOffset: number;

  constructor(
    sequenceText: string,
    startOffset: number,
    nextValueOffset: number,
  ) {
    this._marks = Array.from(sequenceText).map((markText: Mark) => markText);
    this._startOffset = startOffset;
    this._nextValueOffset = nextValueOffset;
  }

  get marks(): Mark[] {
    return this._marks;
  }

  get startOffset(): number {
    return this._startOffset;
  }

  get nextValueOffset(): number {
    return this._nextValueOffset;
  }
}
