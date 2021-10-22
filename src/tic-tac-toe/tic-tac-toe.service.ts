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

  private win(board: Board): number {
    return this.getMovePositionByCondition(
      this.getWinningPosition,
      board.sequences,
      Mark.PLAYER_O,
    );
  }

  private block(board: Board): number {
    return this.getMovePositionByCondition(
      this.getWinningPosition,
      board.sequences,
      Mark.PLAYER_X,
    );
  }

  private getWinningPosition(marks: Mark[], playerMark: Mark): number {
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
    let intersectionPosition = this.getIntersections(
      board.rowSequences,
      [...board.columnSequences, ...board.diagonalSequences],
      Mark.PLAYER_O,
    );

    if (intersectionPosition.length >= 1) return intersectionPosition[0];

    intersectionPosition = this.getIntersections(
      board.columnSequences,
      board.diagonalSequences,
      Mark.PLAYER_O,
    );

    if (intersectionPosition.length >= 1) return intersectionPosition[0];

    return -1;
  }

  private blockFork(board: Board): number {
    const intersections = [
      ...this.getIntersections(
        board.rowSequences,
        [...board.columnSequences, ...board.diagonalSequences],
        Mark.PLAYER_X,
      ),
      ...this.getIntersections(
        board.columnSequences,
        board.diagonalSequences,
        Mark.PLAYER_X,
      ),
    ];

    if (intersections.length === 1) return intersections[0];

    for (const { startOffset, nextValueOffset, marks } of board.sequences) {
      const hasOnePlayerOMark =
        marks.filter((mark) => mark === Mark.PLAYER_O).length === 1;
      const hasTwoEmptySpaces =
        marks.filter((mark) => mark === Mark.EMPTY).length === 2;
      if (hasOnePlayerOMark && hasTwoEmptySpaces) {
        const markPositions = marks.map((_, index) => index);

        for (const markPosition of markPositions) {
          if (marks[markPosition] === Mark.EMPTY) {
            const updatedBoard = this.updateBoardWithNextMove(
              board.board,
              startOffset + markPosition * nextValueOffset,
            );
            const boardObject = new Board(updatedBoard);

            const newBoardIntersections = [
              ...this.getIntersections(
                boardObject.rowSequences,
                [
                  ...boardObject.columnSequences,
                  ...boardObject.diagonalSequences,
                ],
                Mark.PLAYER_X,
              ),
              ...this.getIntersections(
                boardObject.columnSequences,
                boardObject.diagonalSequences,
                Mark.PLAYER_X,
              ),
            ];

            if (newBoardIntersections.length < intersections.length) {
              return startOffset + markPosition * nextValueOffset;
            }
          }
        }
      }
    }

    if (intersections.length > 0) return intersections[0];

    return -1;
  }

  private getIntersections(
    sequences: Sequence[],
    sequencesToCompare: Sequence[],
    playerMark: Mark,
  ): number[] {
    const intersections: number[] = [];

    for (const sequence of sequences) {
      const hasOnePlayerOMark =
        sequence.marks.filter((mark) => mark === playerMark).length === 1;
      const hasTwoEmptySpaces =
        sequence.marks.filter((mark) => mark === Mark.EMPTY).length === 2;

      if (hasOnePlayerOMark && hasTwoEmptySpaces) {
        const intersectionPosition = this.getInsersectionPosition(
          sequencesToCompare,
          sequence,
          playerMark,
        );

        if (intersectionPosition !== -1) {
          intersections.push(intersectionPosition);
        }
      }
    }

    return intersections;
  }

  private getInsersectionPosition(
    sequences: Sequence[],
    sequenceToCompare: Sequence,
    playerMark: Mark,
  ): number {
    for (const { startOffset, nextValueOffset, marks } of sequences) {
      const hasOnePlayerOMark =
        marks.filter((mark) => mark === playerMark).length === 1;
      const hasTwoEmptySpaces =
        marks.filter((mark) => mark === Mark.EMPTY).length === 2;

      if (hasOnePlayerOMark && hasTwoEmptySpaces) {
        const sequencePositions = sequenceToCompare.marks.map(
          (_, index) =>
            sequenceToCompare.startOffset +
            index * sequenceToCompare.nextValueOffset,
        );
        const intersectionPosition = marks.findIndex((mark, index) => {
          const currentPosition = startOffset + index * nextValueOffset;
          return (
            sequencePositions.includes(currentPosition) && mark === Mark.EMPTY
          );
        });

        if (intersectionPosition !== -1) {
          return startOffset + intersectionPosition * nextValueOffset;
        }
      }
    }

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
}
