export interface PollOption {
  text: string;
  votes_count: number;
  votes_percentage: number;
}

export interface PollData {
  id: string;
  title: string;
  options: PollOption[];
  total_votes: Number;
}
