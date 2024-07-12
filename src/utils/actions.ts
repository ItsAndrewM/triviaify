import { slugify } from "./helpers";

export const createSession = async (formData: FormData) => {
	let session_code = formData.get("session_code") as string;
	const creator_name = formData.get("creator_name") as string;
	const name = formData.get("name") as string;

	if (!session_code || !creator_name || !name) {
		return { error: "Session code and creator name are required" };
	}
	const session_name = session_code;
	session_code = slugify(session_code);
	const session = {
		session_code,
		creator_name,
		session_name,
		name,
	};
	const result = await fetch(`${process.env.SITE_URL}/api/sessions/create`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(session),
	});
	if (!result.ok) {
		return { error: "Something went wrong" };
	}
	// const data = await result.json();
	// return data;
	return result;
};

export const joinSession = async (formData: FormData) => {
	const session_code = formData.get("session_code") as string;
	const name = formData.get("name") as string;
	const display_name = formData.get("display_name") as string;

	if (!session_code || !name || !display_name) {
		return { error: "Session code, name, and display name are required" };
	}

	const session = {
		session_code,
		name,
		display_name,
	};
	const result = await fetch(`${process.env.SITE_URL}/api/sessions/join`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(session),
	});
	if (!result.ok) {
		return { error: "Something went wrong" };
	}
	// const data = await result.json();
	// return data;
	return result;
};
