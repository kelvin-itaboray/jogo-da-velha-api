import { IsDefined, Length, Matches } from 'class-validator';

export class MakeMoveRequestDTO {
  @Length(9, 9)
  @IsDefined()
  @Matches(/^([ox ]){9}$/)
  board: string;
}
