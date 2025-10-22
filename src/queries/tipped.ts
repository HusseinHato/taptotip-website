// src/queries/tipped.ts
export const TIPPED_RECEIVED = `
  query TippedReceived($to: String!, $limit: Int!, $offset: Int!) {
    TipJar_Tipped(where: { to: { _eq: $to } }, limit: $limit, offset: $offset, order_by: { id: desc }) {
      id from to amount fee ref
    }
  }
`;
