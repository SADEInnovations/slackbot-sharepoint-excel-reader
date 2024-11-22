/* Copyright */
export function findUserRow(excelData: any, userName: string): any {
  const rows = excelData.values;

  for (let i = 3; i < rows.length; i++) {
    const row = rows[i];

    let lastColumnUsername = row[13];

    if (lastColumnUsername == null || lastColumnUsername === "") {
      continue;
    }

    lastColumnUsername = lastColumnUsername.trim().toLowerCase();

    if (lastColumnUsername === userName.trim().toLowerCase()) {
      const remainingTotalBudget = row[1];
      const remainingTotalPayable = row[2];

      return {
        remainingTotalBudget,
        remainingTotalPayable,
      };
    }
  }

  throw new Error(`Username ${userName} not found.`);
}
