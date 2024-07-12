import { ActiveSession } from "@/app/api/sessions/active/route";
import { fetcher } from "@/utils/helpers";
import useSWR from "swr";

const useFetchActiveSessions = () => {
	const { data, error, mutate } = useSWR<ActiveSession[]>(
		"http://localhost:3000/api/sessions/active",
		fetcher
	);

	return {
		data: data || [],
		loading: !error && !data,
		error,
		mutate,
	};
};

export default useFetchActiveSessions;
