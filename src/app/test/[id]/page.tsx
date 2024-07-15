import { ChatRoom } from "@/components/component/chat-room";

export const generateStaticParams = async () => [{ id: "1" }, { id: "2" }];

export default function TestPage({ params }: { params: { id: string } }) {
	return (
		<div className="w-full max-w-3xl mx-auto my-24">
			Test Page: {params.id}
			<ChatRoom sessionCode={params.id} />
		</div>
	);
}
