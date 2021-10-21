import { Injectable } from '@nestjs/common';
import { Mark } from './enums/mark.enum';

@Injectable()
export class TicTacToeService {
  public makeMove(board: string): string {
    // TODO validar se é a vez do jogador o

    const nextMovePosition = this.chooseMove(board);

    // TODO validar se a posição escolhida é uma posição válida no tabuleiro

    const updatedBoard =
      board.substring(0, nextMovePosition) +
      Mark.PLAYER_O +
      board.substring(nextMovePosition + 1);

    return updatedBoard;
  }

  private chooseMove(board: string): number {
    let nextMove = -1;

    nextMove = this.win(board);
    if (nextMove !== -1) return nextMove;

    nextMove = this.block(board);
    if (nextMove !== -1) return nextMove;

    nextMove = this.fork(board);
    if (nextMove !== -1) return nextMove;

    nextMove = this.blockFork(board);
    if (nextMove !== -1) return nextMove;

    nextMove = this.playCenter(board);
    if (nextMove !== -1) return nextMove;

    nextMove = this.playOppositeCorner(board);
    if (nextMove !== -1) return nextMove;

    nextMove = this.playEmptyCorner(board);
    if (nextMove !== -1) return nextMove;

    nextMove = this.playEmptySide(board);
    if (nextMove !== -1) return nextMove;

    return -1;
  }

  private win(board: string): number {
    return this.getWinningPosition(board, Mark.PLAYER_O);
  }

  private block(board: string): number {
    return this.getWinningPosition(board, Mark.PLAYER_X);
  }

  private getWinningPosition(board: string, playerMark: Mark) {
    const row1 = {
      startOffset: 0,
      nextValueOffset: 1,
      sequence: board.substring(0, 3),
    };
    const row2 = {
      startOffset: 3,
      nextValueOffset: 1,
      sequence: board.substring(3, 6),
    };
    const row3 = {
      startOffset: 6,
      nextValueOffset: 1,
      sequence: board.substring(6, 9),
    };
    const column1 = {
      startOffset: 0,
      nextValueOffset: 3,
      sequence: `${board[0]}${board[3]}${board[6]}`,
    };
    const column2 = {
      startOffset: 1,
      nextValueOffset: 3,
      sequence: `${board[1]}${board[4]}${board[7]}`,
    };
    const column3 = {
      startOffset: 2,
      nextValueOffset: 3,
      sequence: `${board[2]}${board[5]}${board[8]}`,
    };
    const diagonal1 = {
      startOffset: 0,
      nextValueOffset: 4,
      sequence: `${board[0]}${board[4]}${board[8]}`,
    };
    const diagonal2 = {
      startOffset: 2,
      nextValueOffset: 2,
      sequence: `${board[2]}${board[4]}${board[6]}`,
    };

    const sequenceList = [
      row1,
      row2,
      row3,
      column1,
      column2,
      column3,
      diagonal1,
      diagonal2,
    ];

    for (const { startOffset, nextValueOffset, sequence } of sequenceList) {
      if (this.canWin(sequence, playerMark)) {
        const winningPosition =
          startOffset + sequence.indexOf(Mark.EMPTY) * nextValueOffset;
        return winningPosition;
      }
    }

    return -1;
  }

  private canWin(sequence: string, playerMark: Mark): boolean {
    const sequenceArray = Array.from(sequence);
    const hasTwoMarks =
      sequenceArray.filter((currentMark) => currentMark === playerMark)
        .length === 2;
    const hasOneEmptySpace =
      sequenceArray.filter((currentMark) => currentMark === Mark.EMPTY)
        .length === 1;
    return hasTwoMarks && hasOneEmptySpace;
  }

  private fork(board: string): number {
    return -1;
  }

  private blockFork(board: string): number {
    return -1;
  }

  private playCenter(board: string): number {
    if (board[4] === Mark.EMPTY) return 4;

    return -1;
  }

  private playOppositeCorner(board: string): number {
    const diagonal1 = {
      startOffset: 0,
      nextValueOffset: 4,
      sequence: `${board[0]}${board[4]}${board[8]}`,
    };
    const diagonal2 = {
      startOffset: 2,
      nextValueOffset: 2,
      sequence: `${board[2]}${board[4]}${board[6]}`,
    };

    for (const { startOffset, nextValueOffset, sequence } of [
      diagonal1,
      diagonal2,
    ]) {
      const availableCorner = this.getOppositeCornerFromPlayerX(sequence);
      if (availableCorner) {
        const availablePosition =
          startOffset + availableCorner * nextValueOffset;
        return availablePosition;
      }
    }

    return -1;
  }

  private getOppositeCornerFromPlayerX(sequence: string): number {
    const sequenceArray = Array.from(sequence);
    const availableCorner = sequenceArray.findIndex(
      (currentMark, index) => currentMark === Mark.EMPTY && index != 1,
    );
    const playerXCorner = sequenceArray.findIndex(
      (currentMark, index) => currentMark === Mark.PLAYER_X && index != 1,
    );
    if (availableCorner !== -1 && playerXCorner !== -1) {
      return availableCorner;
    }
  }

  private playEmptyCorner(board: string): number {
    const diagonal1 = {
      startOffset: 0,
      nextValueOffset: 4,
      sequence: `${board[0]}${board[4]}${board[8]}`,
    };
    const diagonal2 = {
      startOffset: 2,
      nextValueOffset: 2,
      sequence: `${board[2]}${board[4]}${board[6]}`,
    };

    for (const { startOffset, nextValueOffset, sequence } of [
      diagonal1,
      diagonal2,
    ]) {
      const availableCorner = this.getAvailableSideOrCorner(sequence);
      if (availableCorner !== -1) {
        const availablePosition =
          startOffset + availableCorner * nextValueOffset;
        return availablePosition;
      }
    }

    return -1;
  }

  private playEmptySide(board: string): number {
    const column2 = {
      startOffset: 1,
      nextValueOffset: 3,
      sequence: `${board[1]}${board[4]}${board[7]}`,
    };
    const row2 = {
      startOffset: 3,
      nextValueOffset: 1,
      sequence: board.substring(3, 6),
    };

    for (const { startOffset, nextValueOffset, sequence } of [column2, row2]) {
      const availableSide = this.getAvailableSideOrCorner(sequence);
      if (availableSide !== -1) {
        const availablePosition = startOffset + availableSide * nextValueOffset;
        return availablePosition;
      }
    }

    return -1;
  }

  private getAvailableSideOrCorner(sequence: string): number {
    const sequenceArray = Array.from(sequence);
    const availableCorner = sequenceArray.findIndex(
      (currentMark, index) => currentMark === Mark.EMPTY && index != 1,
    );
    if (availableCorner !== -1) {
      return availableCorner;
    }

    return -1;
  }
}
