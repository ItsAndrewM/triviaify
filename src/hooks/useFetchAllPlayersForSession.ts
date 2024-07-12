import {
	Player,
	SessionResult,
} from "@/app/api/sessions/session/[session_code]/players/route";
import { fetcher } from "@/utils/helpers";
import useSWR from "swr";

export interface SessionAndPlayers {
	session: SessionResult;
	players: Player[];
}

const useFetchActiveSessions = (sessionCode: string) => {
	const { data, error, mutate } = useSWR<SessionAndPlayers>(
		`${process.env.NEXT_PUBLIC_SITE_URL}/api/sessions/session/${sessionCode}/players`,
		fetcher
	);

	return {
		data: data as SessionAndPlayers,
		loading: !error && !data,
		error,
		mutate,
	};
};

export default useFetchActiveSessions;
