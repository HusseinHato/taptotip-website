import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { TIPPED_RECEIVED } from "../queries/tipped";
import { gql } from "../lib/envioClient";

type Tip = { id: string; from: string; to: string; amount: string; fee: string; ref?: string | null };

export function useAllTimeEarnings(toAddr?: `0x${string}`) {
  const addr = useMemo(() => toAddr, [toAddr]);

  return useQuery({
    enabled: !!addr,
    queryKey: ["TipJar_Tipped", "totals", addr],
    queryFn: async () => {
      const pageSize = 500;   // tune as needed
      let offset = 0;
      let gross = 0n, fee = 0n, count = 0;
      // paginate until fewer than pageSize returned
      // (add a hard stop to be safe for very large datasets)
      for (let safety = 0; safety < 1000; safety++) {
        const data = await gql<{ TipJar_Tipped: Tip[] }>(
          TIPPED_RECEIVED,
          { to: addr, limit: pageSize, offset }
        );
        const rows = data?.TipJar_Tipped ?? [];
        for (const r of rows) {
          gross += BigInt(r.amount);
          fee   += BigInt(r.fee || "0");
        }
        count += rows.length;
        if (rows.length < pageSize) break;
        offset += pageSize;
      }
      const net = gross - fee;
      return { gross, fee, net, count };
    },
    staleTime: 30_000, // cache for 30s
  });
}