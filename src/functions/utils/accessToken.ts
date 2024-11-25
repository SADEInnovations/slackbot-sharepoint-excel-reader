/* Copyright */

const TOKEN_EXPIRATION_TIME = (expiresIn: number): number => Date.now() + expiresIn * 1000 - 5000;

interface TokenCache {
  token: string;
  expiresAt: number;
}

interface AccessTokenResponse {
  access_token: string;
  expires_in: number;
}

let tokenCache: TokenCache | undefined = undefined;

export async function getCachedAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    console.log("Using cached access token");
    return tokenCache.token;
  }

  console.log("Fetching new access token");
  const url = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    client_id: process.env.CLIENT_ID as string,
    client_secret: process.env.CLIENT_SECRET as string,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  });

  const response = await fetch(url, {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusText}`);
  }

  const data: AccessTokenResponse = await response.json();

  tokenCache = {
    token: data.access_token,
    expiresAt: TOKEN_EXPIRATION_TIME(data.expires_in),
  };

  return tokenCache.token;
}
