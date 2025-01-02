export type PollOption = {
  _id: string;
  text: string;
  votes_count: number;
};

export type PollData = {
  _id: string;
  id: string;
  title: string;
  options: PollOption[];
  is_open: boolean;
  total_votes: number;
  owner_username: string;
};