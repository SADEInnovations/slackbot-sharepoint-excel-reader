/* Copyright */
import fetch from "node-fetch";
import { getCachedAccessToken } from "./accessToken";

export async function fetchExcelData(
  accessToken: string,
  driveItemId: string,
  worksheetId: string,
  range: string
): Promise<any> {
  const url = `https://graph.microsoft.com/v1.0/drive/items/${driveItemId}/workbook/worksheets/${worksheetId}/range(address='${range}')`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Excel data: ${response.statusText}`);
  }

  return await response.json();
}

const excelDataCache = new Map<string, { data: any; expiresAt: number }>();

export async function fetchExcelDataWithCache(driveItemId: string, worksheetId: string, range: string): Promise<any> {
  const cacheKey = `${driveItemId}-${worksheetId}-${range}`;
  const cachedEntry = excelDataCache.get(cacheKey);

  if (cachedEntry && Date.now() < cachedEntry.expiresAt) {
    console.log("Using cached Excel data");
    return cachedEntry.data;
  }

  console.log("Fetching Excel data from API");
  const accessToken = await getCachedAccessToken();
  const url = `https://graph.microsoft.com/v1.0/drive/items/${driveItemId}/workbook/worksheets/${worksheetId}/range(address='${range}')`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Excel data: ${response.statusText}`);
  }

  const data = await response.json();
  excelDataCache.set(cacheKey, { data, expiresAt: Date.now() + 5 * 60 * 1000 }); // Cache for 5 minutes

  return data;
}
