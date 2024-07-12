import { WaitingRoom } from "@/components/component/waiting-room";
import { cookies } from "next/headers";

interface WaitingRoomPageProps {
	params: {
		session_code: string;
	};
}
export default function WaitingRoomPage({ params }: WaitingRoomPageProps) {
	const playerId = cookies().get("player_id")?.value || "";
	console.log("player_id", playerId);
	return (
		<div>
			{!params.session_code ? null : (
				<WaitingRoom session_code={params.session_code} playerId={playerId} />
			)}
		</div>
	);
}
