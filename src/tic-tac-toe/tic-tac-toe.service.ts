import { BadRequestException, Injectable } from '@nestjs/common';
import { Board } from './classes/board';
import { Sequence } from './classes/sequence';
import { BoardPosition } from './enums/board-position.enum';
import { Mark } from './enums/mark.enum';
import { SequencePosition } from './enums/sequence-position.enum';
import { TicTacToeException } from './tic-tac-toe.exception';

@Injectable()
export class TicTacToeService {
  public makeMove(boardText: string): string {
    this.isValidTurn(boardText);

    const board = new Board(boardText);

    this.isGameFinished(board.sequences);

    const nextMovePosition = this.chooseMove(board);

    return this.updateBoardWithNextMove(boardText, nextMovePosition);
  }

  private chooseMove(board: Board): number {
    return (
      this.win(board) ??
      this.block(board) ??
      this.fork(board) ??
      this.blockFork(board) ??
      this.playCenter(board) ??
      this.playOppositeCorner(board) ??
      this.playEmptyCorner(board) ??
      this.playEmptySide(board)
    );
  }

  private isValidTurn(board: string): void {
    const boardArray = Array.from(board);
    const playerOMarks = boardArray.filter((mark) => mark === Mark.PLAYER_O);
    const playerXMarks = boardArray.filter((mark) => mark === Mark.PLAYER_X);

    this.isPlayerOTurn(playerOMarks, playerXMarks);
    this.isBoardFull(playerOMarks, playerXMarks, boardArray);
  }

  private isPlayerOTurn(playerOMarks: string[], playerXMarks: string[]): void {
    const isPlayerOTurn =
      playerOMarks.length === playerXMarks.length ||
      playerOMarks.length + 1 === playerXMarks.length;
    if (!isPlayerOTurn) {
      throw new BadRequestException(TicTacToeException.INVALID_PLAYER_TURN);
    }
  }

  private isBoardFull(
    playerOMarks: string[],
    playerXMarks: string[],
    boardArray: string[],
  ): void {
    const hasMovesAvailablesToPlay =
      playerOMarks.length + playerXMarks.length < boardArray.length;
    if (!hasMovesAvailablesToPlay) {
      throw new BadRequestException(TicTacToeException.NO_MOVES_LEFT);
    }
  }

  private isGameFinished(sequences: Sequence[]): void {
    for (const { marks } of sequences) {
      const playerOWon = marks.every((mark) => mark === Mark.PLAYER_O);
      const playerXWon = marks.every((mark) => mark === Mark.PLAYER_X);
      if (playerOWon || playerXWon) {
        throw new BadRequestException(TicTacToeException.GAME_ALREADY_FINISHED);
      }
    }
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
      (marks, playerMark) => this.getWinningPosition(marks, playerMark),
      board.sequences,
      Mark.PLAYER_O,
    );
  }

  private block(board: Board): number {
    return this.getMovePositionByCondition(
      (marks, playerMark) => this.getWinningPosition(marks, playerMark),
      board.sequences,
      Mark.PLAYER_X,
    );
  }

  private getWinningPosition(marks: Mark[], playerMark: Mark): number {
    const hasTwoPlayerMarks =
      marks.filter((mark) => mark === playerMark).length === 2;
    const hasOneEmptySpace =
      marks.filter((mark) => mark === Mark.EMPTY).length === 1;

    if (hasTwoPlayerMarks && hasOneEmptySpace) {
      return marks.indexOf(Mark.EMPTY);
    }
  }

  private fork(board: Board): number {
    const intersectionPosition = this.getIntersectionsInBoard(
      board,
      Mark.PLAYER_O,
      true,
    );
    if (intersectionPosition.length > 0) return intersectionPosition[0];
  }

  private blockFork(board: Board): number {
    const currentIntersections = this.getIntersectionsInBoard(
      board,
      Mark.PLAYER_X,
    );

    for (const { startOffset, nextValueOffset, marks } of board.sequences) {
      if (this.isIntersectableSequence(marks, Mark.PLAYER_O)) {
        const markPositions = marks.map((_, index) => index);

        for (const markPosition of markPositions) {
          if (marks[markPosition] === Mark.EMPTY) {
            const markPositionInBoard = this.getMarkPositionInBoard(
              startOffset,
              nextValueOffset,
              markPosition,
            );
            const updatedBoardText = this.updateBoardWithNextMove(
              board.boardText,
              markPositionInBoard,
            );
            const updatedBoard = new Board(updatedBoardText);
            const updatedIntersections = this.getIntersectionsInBoard(
              updatedBoard,
              Mark.PLAYER_X,
            );

            if (updatedIntersections.length < currentIntersections.length) {
              return markPositionInBoard;
            }
          }
        }
      }
    }
  }

  private getIntersectionsInBoard(
    board: Board,
    playerMark: Mark,
    stopOnFirstResult = false,
  ): number[] {
    const intersectionsWithLines = this.getIntersectionsBetweenSequences(
      board.rowSequences,
      [...board.columnSequences, ...board.diagonalSequences],
      playerMark,
      stopOnFirstResult,
    );

    if (stopOnFirstResult && intersectionsWithLines.length === 1) {
      return intersectionsWithLines;
    }

    return intersectionsWithLines;
  }

  private getIntersectionsBetweenSequences(
    sequences: Sequence[],
    sequencesToCompare: Sequence[],
    playerMark: Mark,
    stopOnFirstResult: boolean,
  ): number[] {
    const intersections: number[] = [];

    for (const sequence of sequences) {
      if (this.isIntersectableSequence(sequence.marks, playerMark)) {
        const intersectionPosition = this.getInsersectionWithSequence(
          sequencesToCompare,
          sequence,
          playerMark,
        );

        if (this.isValidBoardPosition(intersectionPosition)) {
          if (stopOnFirstResult) return [intersectionPosition];
          intersections.push(intersectionPosition);
        }
      }
    }

    return intersections;
  }

  private getInsersectionWithSequence(
    sequences: Sequence[],
    sequenceToCompare: Sequence,
    playerMark: Mark,
  ): number {
    for (const { startOffset, nextValueOffset, marks } of sequences) {
      if (this.isIntersectableSequence(marks, playerMark)) {
        const sequencePositions = sequenceToCompare.marks.map((_, index) =>
          this.getMarkPositionInBoard(
            sequenceToCompare.startOffset,
            sequenceToCompare.nextValueOffset,
            index,
          ),
        );
        const intersectionPosition = marks.findIndex((mark, position) => {
          const positionInBoard = this.getMarkPositionInBoard(
            startOffset,
            nextValueOffset,
            position,
          );
          const isAvailableIntersectablePosition =
            sequencePositions.includes(positionInBoard) && mark === Mark.EMPTY;

          return isAvailableIntersectablePosition;
        });

        if (this.isValidBoardPosition(intersectionPosition)) {
          return this.getMarkPositionInBoard(
            startOffset,
            nextValueOffset,
            intersectionPosition,
          );
        }
      }
    }
  }

  private isIntersectableSequence(marks: Mark[], playerMark: Mark) {
    const hasOnePlayerMark =
      marks.filter((mark) => mark === playerMark).length === 1;
    const hasTwoEmptySpaces =
      marks.filter((mark) => mark === Mark.EMPTY).length === 2;
    return hasOnePlayerMark && hasTwoEmptySpaces;
  }

  private playCenter(board: Board): number {
    if (board.boardCenter === Mark.EMPTY) return BoardPosition.MIDDLE;
  }

  private playOppositeCorner(board: Board): number {
    return this.getMovePositionByCondition(
      (marks, playerMark) =>
        this.getOppositePositionFromPlayer(marks, playerMark),
      board.diagonalSequences,
      Mark.PLAYER_X,
    );
  }

  private getOppositePositionFromPlayer(
    marks: Mark[],
    playerMark: Mark,
  ): number {
    const availablePosition = marks.findIndex(
      (mark, index) => mark === Mark.EMPTY && index != SequencePosition.MIDDLE,
    );
    const playerPosition = marks.findIndex(
      (mark, index) => mark === playerMark && index != SequencePosition.MIDDLE,
    );

    if (
      this.isValidBoardPosition(availablePosition) &&
      this.isValidBoardPosition(playerPosition)
    ) {
      return availablePosition;
    }
  }

  private playEmptyCorner(board: Board): number {
    return this.getMovePositionByCondition(
      (marks) => this.getAvailableSideOrCorner(marks),
      board.diagonalSequences,
    );
  }

  private playEmptySide(board: Board): number {
    return this.getMovePositionByCondition(
      (marks) => this.getAvailableSideOrCorner(marks),
      board.middleSequences,
    );
  }

  private getAvailableSideOrCorner(marks: Mark[]): number {
    const availablePosition = marks.findIndex(
      (currentMark, index) => currentMark === Mark.EMPTY && index != 1,
    );

    if (this.isValidBoardPosition(availablePosition)) {
      return availablePosition;
    }
  }

  private getMovePositionByCondition(
    conditionToMakeMove: (marks: Mark[], playerMark?: Mark) => number,
    sequences: Sequence[],
    playerMark?: Mark,
  ): number {
    for (const { startOffset, nextValueOffset, marks } of sequences) {
      const availablePosition = conditionToMakeMove(marks, playerMark);

      if (this.isValidBoardPosition(availablePosition)) {
        const nextMovePosition = this.getMarkPositionInBoard(
          startOffset,
          nextValueOffset,
          availablePosition,
        );
        return nextMovePosition;
      }
    }
  }

  private getMarkPositionInBoard(
    startOffset: number,
    nextValueOffset: number,
    positionInSequence: number,
  ): number {
    return startOffset + nextValueOffset * positionInSequence;
  }

  private isValidBoardPosition(position: number): boolean {
    return Object.values(BoardPosition).includes(position);
  }
}
