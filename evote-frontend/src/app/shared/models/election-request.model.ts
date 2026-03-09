import { VoterDTO } from "./voter-dto.model";

export interface ElectionRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  options: string[];
  voters: VoterDTO[];
}