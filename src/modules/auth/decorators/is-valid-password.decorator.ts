import { applyDecorators } from '@nestjs/common';
import { Length } from 'class-validator';

export const IsValidPassword = () => applyDecorators(Length(6, 20));
