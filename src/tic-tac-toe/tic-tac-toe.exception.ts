export class TicTacToeException {
  public static readonly INVALID_LENGTH = 'Board must contain 9 characters.';
  public static readonly INVALID_BOARD =
    "A query param 'board' must be informed.";
  public static readonly INVALID_BOARD_VALUE =
    "Board must contain only 'o', 'x' or empty spaces as characters.";
  public static readonly INVALID_PLAYER_TURN =
    "It is not player o's turn to play.";
  public static readonly NO_MOVES_LEFT = 'There are no moves left to play.';
  public static readonly GAME_ALREADY_FINISHED =
    'No move is possible. Game is already finished.';
}
