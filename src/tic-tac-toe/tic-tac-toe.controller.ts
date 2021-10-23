import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { MakeMoveRequestDTO } from './dtos/make-move-request.dto';
import { TicTacToeService } from './tic-tac-toe.service';

@Controller()
export class TicTacToeController {
  constructor(private readonly ticTacToeService: TicTacToeService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  makeMove(@Query() query: MakeMoveRequestDTO): string {
    return this.ticTacToeService.makeMove(query.board);
  }
}
