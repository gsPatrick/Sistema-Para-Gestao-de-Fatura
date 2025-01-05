import { PartialType } from '@nestjs/mapped-types';
import { CreateStatusTypeDto } from './create-status-type.dto';

export class UpdateStatusTypeDto extends PartialType(CreateStatusTypeDto) {}