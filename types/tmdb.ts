export type TmdbImageConfig = {
  secure_base_url: string;
  backdrop_sizes: string[];
  poster_sizes: string[];
  profile_sizes: string[];
};

export type TmdbPerson = {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department?: string;
  popularity?: number;
};

export type TmdbSearchPersonResponse = {
  page: number;
  results: TmdbPerson[];
  total_pages: number;
  total_results: number;
};

export type TmdbPersonDetails = {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department?: string;
};

export type TmdbCredit = {
  id: number;
  media_type?: "movie" | "tv";
  title?: string;
  name?: string;
  character?: string;
  job?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string | null;
  vote_average?: number;
};

export type TmdbCombinedCredits = {
  cast: TmdbCredit[];
  crew: TmdbCredit[];
};

