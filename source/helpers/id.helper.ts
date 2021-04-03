import randomatic from 'randomatic';
import {
  LENGTH_ID_MESSAGE,
  PATTERN_ID_MESSAGE,
} from '../constants/global.constants';

class IdHelper {
  static getId() {
    return randomatic(PATTERN_ID_MESSAGE, LENGTH_ID_MESSAGE);
  }
}

export default IdHelper;
