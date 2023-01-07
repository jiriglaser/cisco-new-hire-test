import { Gender } from './gender.model';

export interface Employee {
  name: string;
  jobTitle: string;
  tenure: number;
  gender: Gender;
}
