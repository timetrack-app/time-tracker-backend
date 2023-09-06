import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class SignUpCredentialsDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(10)
  password: string;
}
