import { Injectable } from '@nestjs/common';

@Injectable()
export class TicTacToeService {
  public makeMove(board: string): string {
    return board;
  }
}
