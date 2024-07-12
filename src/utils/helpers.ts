export const getActiveSessions = async () => {
	const result = await fetch(`${process.env.SITE_URL}/api/sessions/active`);
	const data = await result.json();
	return data;
};

export const getSession = async (sessionId: string) => {
	const result = await fetch(
		`${process.env.SITE_URL}/api/sessions/${sessionId}`
	);
	const data = await result.json();
	return data;
};

export const createSession = async (session: any) => {
	const result = await fetch(`${process.env.SITE_URL}/api/sessions`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(session),
	});
	const data = await result.json();
	return data;
};

export const joinSession = async (sessionId: string, userId: string) => {
	const result = await fetch(
		`${process.env.SITE_URL}/api/sessions/${sessionId}/join`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				userId,
			}),
		}
	);
	const data = await result.json();
	return data;
};

export const getUser = async (userId: string) => {
	const result = await fetch(`${process.env.SITE_URL}/api/users/${userId}`);
	const data = await result.json();
	return data;
};

export const createUser = async (user: any) => {
	const result = await fetch(`${process.env.SITE_URL}/api/users`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(user),
	});
	const data = await result.json();
	return data;
};

export const updateUser = async (userId: string, user: any) => {
	const result = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(user),
		}
	);
	const data = await result.json();
	return data;
};

export const deleteUser = async (userId: string) => {
	const result = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
		{
			method: "DELETE",
		}
	);
	const data = await result.json();
	return data;
};

export const slugify = (str: string) => {
	return String(str)
		.normalize("NFKD") // Split accented characters into their base characters and diacritical marks
		.replace(/[\u0300-\u036f]/g, "") // Remove all accents
		.trim() // Trim leading or trailing whitespace
		.toLowerCase() // Convert to lowercase
		.replace(/[^a-z0-9 -]/g, "") // Remove non-alphanumeric characters
		.replace(/\s+/g, "-") // Replace spaces with hyphens
		.replace(/-+/g, "-"); // Remove consecutive hyphens
};

export const fetcher = async (url: string) => {
	const result = await fetch(url);
	const data = await result.json();
	return data;
};

export function handleDbError(error: any) {
	console.error("Database error:", error);

	if (error.code === "23505") {
		// Unique violation
		return { status: 409, message: "This record already exists." };
	} else if (error.code === "23503") {
		// Foreign key violation
		return { status: 400, message: "Invalid reference to another record." };
	} else if (error.code === "23502") {
		// Not null violation
		return { status: 400, message: "Missing required field." };
	} else {
		// Generic error
		return { status: 500, message: "An unexpected error occurred." };
	}
}
