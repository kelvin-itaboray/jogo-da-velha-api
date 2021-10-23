import { Module } from '@nestjs/common';
import { TicTacToeController } from './tic-tac-toe.controller';
import { TicTacToeService } from './tic-tac-toe.service';

@Module({
  providers: [TicTacToeService],
  controllers: [TicTacToeController],
})
export class TicTacToeModule {}
