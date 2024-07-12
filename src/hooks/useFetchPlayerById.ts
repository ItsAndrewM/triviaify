import { fetcher } from "@/utils/helpers";
import useSWR from "swr";

export interface Player {
	id: number;
	display_name: string;
	ready: boolean;
	name: string;
	team_id: number;
}

const useFetchActiveSessions = (session_code: string, player_id: string) => {
	const { data, error, mutate } = useSWR<Player>(
		`${process.env.NEXT_PUBLIC_SITE_URL}/api/sessions/session/${session_code}/players/${player_id}`,
		fetcher
	);

	return {
		data: data,
		loading: !error && !data,
		error,
		mutate,
	};
};

export default useFetchActiveSessions;
