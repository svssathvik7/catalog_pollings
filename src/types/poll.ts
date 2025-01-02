export type PollOption = {
  _id: {
    $oid: string;
  };
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
  voters: string[];
  owner_username: string;
};