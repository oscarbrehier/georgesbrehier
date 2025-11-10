import { supabase } from "@/lib/supabase";

export async function fetchSupabase<T = any>(table: string, where: Record<string, any> = {}, select: string = "*", single = false): Promise<T | null> {

	let query = supabase
		.from(table)
		.select(select);

	for (const key in where) {
		query = query.eq(key, where[key]);
	};

	if (single) {
		query.single();
	};

	const { data, error } = await query;

	if (error || !data) return null;

	return data as T;

};