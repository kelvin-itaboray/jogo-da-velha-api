import { Test, TestingModule } from '@nestjs/testing';
import { MakeMoveRequestDTO } from './dtos/make-move-request.dto';
import { TicTacToeController } from './tic-tac-toe.controller';
import { TicTacToeService } from './tic-tac-toe.service';

describe('TicTacToeController', () => {
  let ticTacToeController: TicTacToeController;

  beforeEach(async () => {
    const controller: TestingModule = await Test.createTestingModule({
      controllers: [TicTacToeController],
      providers: [TicTacToeService],
    }).compile();

    ticTacToeController =
      controller.get<TicTacToeController>(TicTacToeController);
  });

  describe('makeMove', () => {
    it('should return board with player o move', () => {
      const query = new MakeMoveRequestDTO();
      query.board = 'ox o o xx';
      expect(ticTacToeController.makeMove(query)).toBe('ox ooo xx');
    });
  });
});
