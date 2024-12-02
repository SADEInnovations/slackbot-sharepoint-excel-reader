/* Copyright */

import { BonusAmounts, ExcelData } from "./types";

export function findUserRow(excelData: ExcelData, userName: string): BonusAmounts {
  const rows = excelData.values;

  if (rows.length === 0) {
    throw new Error("Excel sheet is empty or data is not properly fetched.");
  }

  // assume that headers are on the first row
  const headers = rows[0];
  console.log("Fetched Headers from Excel file:", headers);

  // look for the wanted headers and change them into a number
  const slackUserIdIndex = headers.findIndex((header) => header.trim().toLowerCase() === "slack bot user id");
  const remainingTotalBudgetIndex = headers.findIndex(
    (header) => header.trim().toLowerCase() === "remaining total budget"
  );
  const remainingTotalPayableIndex = headers.findIndex(
    (header) => header.trim().toLowerCase() === "remaining total payable"
  );
  const reservedTotalIndex = headers.findIndex((header) => header.trim().toLowerCase() === "reserved total");

  if (
    slackUserIdIndex === -1 ||
    remainingTotalBudgetIndex === -1 ||
    remainingTotalPayableIndex === -1 ||
    reservedTotalIndex === -1
  ) {
    throw new Error(
      "One or more required headers are missing in the Excel sheet. Ensure 'Slack Bot User ID', 'Remaining Total Budget', 'Remaining Total Payable', and 'Reserved Total' are present."
    );
  }

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];

    let lastColumnUsername = row[slackUserIdIndex];

    if (lastColumnUsername == null || lastColumnUsername === "") {
      continue;
    }

    lastColumnUsername = lastColumnUsername.trim().toLowerCase();

    if (lastColumnUsername === userName.trim().toLowerCase()) {
      const remainingTotalBudget = Number(row[remainingTotalBudgetIndex]);
      const remainingTotalPayable = Number(row[remainingTotalPayableIndex]);
      const reservedTotal = Number(row[reservedTotalIndex]);

      if (isNaN(remainingTotalBudget) || isNaN(remainingTotalPayable) || isNaN(reservedTotal)) {
        throw new Error("Expected a number, got something else.");
      }

      return {
        usableBonus: remainingTotalBudget,
        payableBonus: remainingTotalPayable,
        reservedTotal: reservedTotal,
      };
    }
  }

  throw new Error(`Username ${userName} not found.`);
}
