import * as randomize from 'randomatic';
import {
  LENGTH_ID_MESSAGE,
  PATTERN_ID_MESSAGE,
} from '../constants/global.constants';

export class IdHelper {
  static getId() {
    return randomize(PATTERN_ID_MESSAGE, LENGTH_ID_MESSAGE);
  }
}
