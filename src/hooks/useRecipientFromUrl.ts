export function useRecipientFromUrl(): `0x${string}` | undefined {
  const params = new URLSearchParams(window.location.search)
  const to = params.get('to')
  return to?.startsWith('0x') ? (to as `0x${string}`) : undefined
}
