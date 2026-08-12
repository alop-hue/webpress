/** Simple line-level diff (LCS). Returns unified-style rows. */
export type DiffRow =
  | { type: "same"; text: string }
  | { type: "add"; text: string }
  | { type: "del"; text: string };

export function diffLines(a: string, b: string): DiffRow[] {
  const A = a ? a.replace(/\r\n/g, "\n").split("\n") : [];
  const B = b ? b.replace(/\r\n/g, "\n").split("\n") : [];
  const n = A.length, m = B.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);

  const rows: DiffRow[] = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (A[i] === B[j]) {
      rows.push({ type: "same", text: A[i] });
      i++; j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      rows.push({ type: "del", text: A[i++] });
    } else {
      rows.push({ type: "add", text: B[j++] });
    }
  }
  while (i < n) rows.push({ type: "del", text: A[i++] });
  while (j < m) rows.push({ type: "add", text: B[j++] });
  return rows;
}

export function diffStats(rows: DiffRow[]): { adds: number; dels: number } {
  let adds = 0, dels = 0;
  for (const r of rows) {
    if (r.type === "add") adds++;
    if (r.type === "del") dels++;
  }
  return { adds, dels };
}

/** Compact diff for display: collapse long runs of unchanged lines */
export function compactDiff(rows: DiffRow[], maxSame = 4): DiffRow[] {
  const out: DiffRow[] = [];
  let run = 0;
  for (const r of rows) {
    if (r.type === "same") {
      run++;
      if (run > maxSame * 2) continue;
      if (run === maxSame + 1) {
        out.push({ type: "same", text: `… ${rows.filter((x) => x.type === "same").length} unchanged lines` });
        continue;
      }
      out.push(r);
    } else {
      run = 0;
      out.push(r);
    }
  }
  return out;
}