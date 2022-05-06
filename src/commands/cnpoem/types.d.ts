interface CnpoemData {
  token: string;
}
interface TokenResponse {
  status: string;
  data: string;
}
type SentenceResponse = SentenceSuccessResponse | SentenceErrorResponse;
interface SentenceSuccessResponse {
  status: string;
  data: {
    id: string;
    content: string;
    popularity: number;
    origin: {
      title: string;
      dynasty: string;
      author: string;
      content: string[];
      translation: string[];
    };
    matchTags: string[];
    recommendedReason: string;
    cacheAt: string;
  };
  token: string;
  ipAddress: string;
}
interface SentenceErrorResponse {
  status: string;
  errCode: number;
  errMessage: string;
}
