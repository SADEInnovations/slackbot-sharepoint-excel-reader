/* Copyright */
import { getCachedAccessToken } from "./accessToken";
import { ExcelData } from "./types";

const cacheDurationInMinutes = 5;
const CACHE_EXPIRATION_TIME = (currentTime: number, cacheDurationInMinutes: number): number =>
  currentTime + cacheDurationInMinutes * 60 * 1000;

const BASE_URL_TEMPLATE =
  "https://graph.microsoft.com/v1.0/drive/items/{driveItemId}/workbook/worksheets/{worksheetId}/range(address='{range}')";

interface ExcelDataCache {
  data: ExcelData;
  expiresAt: number;
}

function formatUrl(driveItemId: string, worksheetId: string, range: string): string {
  return BASE_URL_TEMPLATE.replace("{driveItemId}", driveItemId)
    .replace("{worksheetId}", worksheetId)
    .replace("{range}", range);
}

export async function fetchExcelData(
  accessToken: string,
  driveItemId: string,
  worksheetId: string,
  range: string
): Promise<ExcelData> {
  const url = formatUrl(driveItemId, worksheetId, range);

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
  return data as ExcelData;
}

const excelDataCache = new Map<string, ExcelDataCache>();

export async function fetchExcelDataWithCache(
  driveItemId: string,
  worksheetId: string,
  range: string,
  currentTime: number = Date.now()
): Promise<ExcelData> {
  const cacheKey = `${driveItemId}-${worksheetId}-${range}`;
  const cachedEntry = excelDataCache.get(cacheKey);

  if (cachedEntry && currentTime < cachedEntry.expiresAt) {
    console.log("Using cached Excel data");
    return cachedEntry.data;
  }

  console.log("Fetching Excel data from API");
  const accessToken = await getCachedAccessToken();
  const url = formatUrl(driveItemId, worksheetId, range);

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
  excelDataCache.set(cacheKey, { data, expiresAt: CACHE_EXPIRATION_TIME(currentTime, cacheDurationInMinutes) });

  return data as ExcelData;
}
