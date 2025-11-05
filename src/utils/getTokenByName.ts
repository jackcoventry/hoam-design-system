import tokens from '@/styles/variables.json';

interface Token {
  name: string;
  value: string;
  [key: string]: unknown;
}

function getTokenByName(tokenName?: string): string | undefined {
  if (!tokenName) return;
  const token = (tokens as Token[]).find((t) => t.name === tokenName);
  return token?.value;
}

export default getTokenByName;
