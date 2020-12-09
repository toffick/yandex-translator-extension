import TranslateWithExampleResult from '../core/translate.example.result';
import {ApiService} from './api.service';

export class TranslateService {
  private apiService: ApiService;

  constructor() {
    this.apiService = new ApiService();
  }

  async translateWithExamples(
    originalText: string
  ): Promise<TranslateWithExampleResult[]> {
    return this.apiService.translateWithExamples(originalText);
  }

  async translate(originalText: string): Promise<TranslateWithExampleResult[]> {
    return this.apiService.translate(originalText);
  }
}
