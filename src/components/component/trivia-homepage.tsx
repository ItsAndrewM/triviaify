import { ActiveSessions } from "./active-sessions";
import { HeroTriviaify } from "./hero-triviaify";

export function TriviaHomepage() {
	return (
		<>
			<HeroTriviaify />
			<ActiveSessions />
		</>
	);
}
