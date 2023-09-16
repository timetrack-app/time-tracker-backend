import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class AuthRegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  passwordConfirmation: string;
}
