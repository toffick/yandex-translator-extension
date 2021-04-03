import TranslateWithExampleResult from '../core/translate.example.result';
import ApiService from './api.service';

class TranslateService {

  // async translateWithExamples(
  //   originalText: string,
  // ): Promise<TranslateWithExampleResult[]> {
  //   return ApiService.translateWithExamples(originalText);
  // }

  async translate(originalText: string): Promise<string> {
    return ApiService.translate(originalText);
  }
}

export default new TranslateService();
