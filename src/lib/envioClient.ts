// src/lib/envioClient.ts
export const ENVIO_GQL = import.meta.env.VITE_ENVIO_GQL as string;

export async function gql<T>(query: string, variables?: Record<string, any>) {
  const res = await fetch(ENVIO_GQL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors.map((e: any) => e.message).join("\n"));
  return json.data as T;
}
