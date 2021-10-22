import { Mark } from '../enums/mark.enum';
import { Sequence } from './sequence';

export class Board {
  private _board: string;
  private _row1: Sequence;
  private _row2: Sequence;
  private _row3: Sequence;
  private _column1: Sequence;
  private _column2: Sequence;
  private _column3: Sequence;
  private _diagonal1: Sequence;
  private _diagonal2: Sequence;

  constructor(board: string) {
    this._board = board;
    this._row1 = new Sequence(board.substring(0, 3), 0, 1);
    this._row2 = new Sequence(board.substring(3, 6), 3, 1);
    this._row3 = new Sequence(board.substring(6, 9), 6, 1);
    this._column1 = new Sequence(`${board[0]}${board[3]}${board[6]}`, 0, 3);
    this._column2 = new Sequence(`${board[1]}${board[4]}${board[7]}`, 1, 3);
    this._column3 = new Sequence(`${board[2]}${board[5]}${board[8]}`, 2, 3);
    this._diagonal1 = new Sequence(`${board[0]}${board[4]}${board[8]}`, 0, 4);
    this._diagonal2 = new Sequence(`${board[2]}${board[4]}${board[6]}`, 2, 2);
  }

  get board(): string {
    return this._board;
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
    return this._row2.marks[1];
  }
}
