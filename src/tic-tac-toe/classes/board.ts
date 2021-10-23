import { BoardPosition } from '../enums/board-position.enum';
import { Mark } from '../enums/mark.enum';
import { SequencePosition } from '../enums/sequence-position.enum';
import { TicTacToeConstants as Constants } from '../tic-tac-toe.constants';
import { Sequence } from './sequence';

export class Board {
  private _boardText: string;
  private _row1: Sequence;
  private _row2: Sequence;
  private _row3: Sequence;
  private _column1: Sequence;
  private _column2: Sequence;
  private _column3: Sequence;
  private _diagonal1: Sequence;
  private _diagonal2: Sequence;

  constructor(boardText: string) {
    this._boardText = boardText;
    this._row1 = new Sequence(
      boardText.substring(0, 3),
      BoardPosition.TOP_LEFT,
      Constants.ROW_OFFSET,
    );
    this._row2 = new Sequence(
      boardText.substring(3, 6),
      BoardPosition.MIDDLE_LEFT,
      Constants.ROW_OFFSET,
    );
    this._row3 = new Sequence(
      boardText.substring(6, 9),
      BoardPosition.BOTTOM_LEFT,
      Constants.ROW_OFFSET,
    );
    this._column1 = new Sequence(
      `${boardText[0]}${boardText[3]}${boardText[6]}`,
      BoardPosition.TOP_LEFT,
      Constants.COLUMN_OFFSET,
    );
    this._column2 = new Sequence(
      `${boardText[1]}${boardText[4]}${boardText[7]}`,
      BoardPosition.TOP_MIDDLE,
      Constants.COLUMN_OFFSET,
    );
    this._column3 = new Sequence(
      `${boardText[2]}${boardText[5]}${boardText[8]}`,
      BoardPosition.TOP_RIGHT,
      Constants.COLUMN_OFFSET,
    );
    this._diagonal1 = new Sequence(
      `${boardText[0]}${boardText[4]}${boardText[8]}`,
      BoardPosition.TOP_LEFT,
      Constants.LEFT_TO_RIGHT_DIAGONAL_OFFSET,
    );
    this._diagonal2 = new Sequence(
      `${boardText[2]}${boardText[4]}${boardText[6]}`,
      BoardPosition.TOP_RIGHT,
      Constants.RIGHT_TO_LEFT_DIAGONAL_OFFSET,
    );
  }

  get boardText(): string {
    return this._boardText;
  }

  get sequences(): Sequence[] {
    return [
      this._row1,
      this._row2,
      this._row3,
      this._column1,
      this._column2,
      this._column3,
      this._diagonal1,
      this._diagonal2,
    ];
  }

  get rowSequences(): Sequence[] {
    return [this._row1, this._row2, this._row3];
  }

  get columnSequences(): Sequence[] {
    return [this._column1, this._column2, this._column3];
  }

  get diagonalSequences(): Sequence[] {
    return [this._diagonal1, this._diagonal2];
  }

  get middleSequences(): Sequence[] {
    return [this._column2, this._row2];
  }

  get boardCenter(): Mark {
    return this._row2.marks[SequencePosition.MIDDLE];
  }
}
