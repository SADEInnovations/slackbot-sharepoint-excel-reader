/* Copyright */

import { BonusAmounts, ExcelData } from "./types";

export function findUserRow(excelData: ExcelData, userName: string): BonusAmounts {
  const rows = excelData.values;

  for (let i = 3; i < rows.length; i++) {
    const row = rows[i];

    let lastColumnUsername = row[13];

    if (lastColumnUsername == null || lastColumnUsername === "") {
      continue;
    }

    lastColumnUsername = lastColumnUsername.trim().toLowerCase();

    if (lastColumnUsername === userName.trim().toLowerCase()) {
      const remainingTotalBudget = Number(row[1]);
      const remainingTotalPayable = Number(row[2]);

      if (isNaN(remainingTotalBudget) || isNaN(remainingTotalPayable))
        throw new Error("Expected a number, got something else.");

      return {
        usableBonus: remainingTotalBudget,
        payableBonus: remainingTotalPayable,
      };
    }
  }

  throw new Error(`Username ${userName} not found.`);
}
