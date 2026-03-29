import { OptionDTO } from "./option-dto.model";
import { VoterDTO } from "./voter-dto.model";

export interface ElectionRequest {
  title: string;
  description: string;
  options: OptionDTO[];
  startDate: string;
  endDate: string;
  voters: VoterDTO[];
}