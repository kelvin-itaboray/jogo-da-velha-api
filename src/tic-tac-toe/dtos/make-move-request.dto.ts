import { IsDefined, Length, Matches } from 'class-validator';
import { TicTacToeException } from '../tic-tac-toe.exception';

export class MakeMoveRequestDTO {
  @Length(9, 9, { message: TicTacToeException.INVALID_LENGTH })
  @IsDefined({ message: TicTacToeException.INVALID_BOARD })
  @Matches(/^([ox ]){9}$/, { message: TicTacToeException.INVALID_BOARD_VALUE })
  board: string;
}
