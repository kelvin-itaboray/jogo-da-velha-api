import { Module } from '@nestjs/common';
import { TicTacToeService } from './tic-tac-toe.service';
import { TicTacToeController } from './tic-tac-toe.controller';

@Module({
  providers: [TicTacToeService],
  controllers: [TicTacToeController],
})
export class TicTacToeModule {}
