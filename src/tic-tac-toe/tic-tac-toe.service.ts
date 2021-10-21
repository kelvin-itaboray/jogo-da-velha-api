import { Injectable } from '@nestjs/common';
import { Board } from './classes/board';
import { Sequence } from './classes/sequence';
import { Mark } from './enums/mark.enum';

@Injectable()
export class TicTacToeService {
  public makeMove(boardText: string): string {
    // TODO validar se é a vez do jogador o

    const board = new Board(boardText);
    const nextMovePosition = this.chooseMove(board);

    return this.updateBoardWithNextMove(boardText, nextMovePosition);
  }

  private chooseMove(board: Board): number {
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

    // TODO validar se a posição escolhida é uma posição válida no tabuleiro

    return -1;
  }

  private win(board: Board): number {
    return this.getMovePositionByCondition(
      this.canWin,
      board.sequences,
      Mark.PLAYER_O,
    );
  }

  private block(board: Board): number {
    return this.getMovePositionByCondition(
      this.canWin,
      board.sequences,
      Mark.PLAYER_X,
    );
  }

  private canWin(marks: Mark[], playerMark: Mark): number {
    const hasTwoMarks =
      marks.filter((currentMark) => currentMark === playerMark).length === 2;
    const hasOneEmptySpace =
      marks.filter((currentMark) => currentMark === Mark.EMPTY).length === 1;

    if (hasTwoMarks && hasOneEmptySpace) {
      return marks.indexOf(Mark.EMPTY);
    }

    return -1;
  }

  private fork(board: Board): number {
    return -1;
  }

  private blockFork(board: Board): number {
    return -1;
  }

  private playCenter(board: Board): number {
    if (board.boardCenter === Mark.EMPTY) return 4;

    return -1;
  }

  private playOppositeCorner(board: Board): number {
    return this.getMovePositionByCondition(
      this.getOppositePositionFromPlayer,
      board.diagonalSequences,
      Mark.PLAYER_X,
    );
  }

  private getOppositePositionFromPlayer(
    marks: Mark[],
    playerMark: Mark,
  ): number {
    const availablePosition = marks.findIndex(
      (currentMark, index) => currentMark === Mark.EMPTY && index != 1,
    );
    const playerPosition = marks.findIndex(
      (currentMark, index) => currentMark === playerMark && index != 1,
    );

    if (availablePosition !== -1 && playerPosition !== -1) {
      return availablePosition;
    }

    return -1;
  }

  private playEmptyCorner(board: Board): number {
    return this.getMovePositionByCondition(
      this.getAvailableSideOrCorner,
      board.diagonalSequences,
    );
  }

  private playEmptySide(board: Board): number {
    return this.getMovePositionByCondition(
      this.getAvailableSideOrCorner,
      board.middleSequences,
    );
  }

  private getAvailableSideOrCorner(marks: Mark[]): number {
    const availablePosition = marks.findIndex(
      (currentMark, index) => currentMark === Mark.EMPTY && index != 1,
    );

    if (availablePosition !== -1) {
      return availablePosition;
    }

    return -1;
  }

  private getMovePositionByCondition(
    conditionToMakeMove: (marks: Mark[], playerMark?: Mark) => number,
    sequences: Sequence[],
    playerMark?: Mark,
  ): number {
    for (const { startOffset, nextValueOffset, marks } of sequences) {
      const availablePosition = conditionToMakeMove(marks, playerMark);

      if (availablePosition !== -1) {
        const nextMovePosition =
          startOffset + availablePosition * nextValueOffset;
        return nextMovePosition;
      }
    }

    return -1;
  }

  private updateBoardWithNextMove(
    boardText: string,
    nextMovePosition: number,
  ): string {
    return (
      boardText.substring(0, nextMovePosition) +
      Mark.PLAYER_O +
      boardText.substring(nextMovePosition + 1)
    );
  }
}
