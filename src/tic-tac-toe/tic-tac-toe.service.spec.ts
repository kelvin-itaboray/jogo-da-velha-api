import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TicTacToeService } from './tic-tac-toe.service';

describe('TicTacToeService', () => {
  let service: TicTacToeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicTacToeService],
    }).compile();

    service = module.get<TicTacToeService>(TicTacToeService);
  });

  describe('makeMove', () => {
    describe('if it is not player o turn', () => {
      it('should return BadRequestException', () => {
        expect(() => service.makeMove('    o    ')).toThrow(
          new BadRequestException('TODO EXCEPTION'),
        );
      });
    });

    describe('if the next move makes player o win', () => {
      describe('and player o has 2 horizontal marks in the first row', () => {
        it('should place a third mark next to them', () => {
          expect(service.makeMove('oo  x x  ')).toEqual('ooo x x  ');
        });
      });

      describe('and player o has 2 horizontal marks in the second row', () => {
        it('should place a third mark next to them', () => {
          expect(service.makeMove('  x oox  ')).toEqual('  xooox  ');
        });
      });

      describe('and player o has 2 horizontal marks in the third row', () => {
        it('should place a third mark next to them', () => {
          expect(service.makeMove(' x  x o o')).toEqual(' x  x ooo');
        });
      });

      describe('and player o has 2 vertical marks in the first column', () => {
        it('should place a third mark next to them', () => {
          expect(service.makeMove('o  oxx   ')).toEqual('o  oxxo  ');
        });
      });

      describe('and player o has 2 vertical marks in the second column', () => {
        it('should place a third mark next to them', () => {
          expect(service.makeMove('  x ox o ')).toEqual(' ox ox o ');
        });
      });

      describe('and player o has 2 vertical marks in the third column', () => {
        it('should place a third mark next to them', () => {
          expect(service.makeMove('x o xo   ')).toEqual('x o xo  o');
        });
      });

      describe('and player o has 2 diagonal marks in left to right diagonal', () => {
        it('should place a third mark to complete it', () => {
          expect(service.makeMove('o  xo x  ')).toEqual('o  xo x o');
        });
      });

      describe('and player o has 2 diagonal marks in right to left diagonal', () => {
        it('should place a third mark to complete it', () => {
          expect(service.makeMove('  ox  o x')).toEqual('  oxo o x');
        });
      });
    });

    describe('if the next move makes player o lose', () => {
      describe('and player x has 2 horizontal marks in the first row', () => {
        it('should place a third mark next to them', () => {
          expect(service.makeMove('xx o  o  ')).toEqual('xxoo  o  ');
        });
      });

      describe('and player x has 2 horizontal marks in the second row', () => {
        it('should place a third mark next to them', () => {
          expect(service.makeMove(' o  xx o ')).toEqual(' o oxx o ');
        });
      });

      describe('and player x has 2 horizontal marks in the third row', () => {
        it('should place a third mark next to them', () => {
          expect(service.makeMove('  o  ox x')).toEqual('  o  oxox');
        });
      });

      describe('and player x has 2 vertical marks in the first column', () => {
        it('should place a third mark next to them', () => {
          expect(service.makeMove('xoox     ')).toEqual('xoox  o  ');
        });
      });

      describe('and player x has 2 vertical marks in the second column', () => {
        it('should place a third mark next to them', () => {
          expect(service.makeMove('o   xo x ')).toEqual('oo  xo x ');
        });
      });

      describe('and player x has 2 vertical marks in the third column', () => {
        it('should place a third mark next to them', () => {
          expect(service.makeMove('  x o o x')).toEqual('  x ooo x');
        });
      });

      describe('and player x has 2 diagonal marks in left to right diagonal', () => {
        it('should place a third mark to complete it', () => {
          expect(service.makeMove('x o x o  ')).toEqual('x o x o o');
        });
      });

      describe('and player x has 2 diagonal marks in right to left diagonal', () => {
        it('should place a third mark to complete it', () => {
          expect(service.makeMove('   oxox  ')).toEqual('  ooxox  ');
        });
      });
    });

    describe('if the next move can possibly create a fork for player o', () => {
      it('should create a fork by placing a mark at intersection that creates a fork in the board', () => {
        expect(service.makeMove('xox     o')).toEqual('xox    oo');
      });
    });

    describe('if the next move can possibly create a fork for player x', () => {
      describe('and it is possible for player o to make a two in a row', () => {
        it('should make a two in a row to avoid player x from blocking', () => {
          expect(service.makeMove('x   o   x')).toEqual('x  oo   x');
        });
      });

      describe('and it is not possible for player o to make a two in a row', () => {
        it('should block the fork by placing a mark at intersection that creates a fork in the board', () => {
          expect(service.makeMove('o   x   x')).toEqual('o o x   x');
        });
      });
    });

    describe('if neither win, fork or block is possible', () => {
      describe('and center position is empty', () => {
        it('should place a mark at center position', () => {
          expect(service.makeMove('         ')).toEqual('    o    ');
        });
      });

      describe('and center position is not empty', () => {
        describe('and player x placed a mark at any corner', () => {
          it('should place a mark at the opposite corner', () => {
            expect(service.makeMove('  x o    ')).toEqual('  x o o  ');
          });
        });

        describe('and an empty corner is available', () => {
          it('should place a mark at first available corner', () => {
            expect(service.makeMove(' x  o    ')).toEqual('ox  o    ');
          });
        });

        describe('and an empty edge is available', () => {
          it('should place a mark at first available edge', () => {
            expect(service.makeMove('xoxoxxo o')).toEqual('xoxoxxooo');
          });
        });
      });
    });
  });
});
