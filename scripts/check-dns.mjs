import dns from "node:dns/promises";

const domain = process.argv[2];
if (!domain) {
  console.error("Usage: node scripts/check-dns.mjs <domain>");
  process.exit(1);
}

(async () => {
  const report = { domain, A: [], CNAME: [], TXT: [], advice: [] };

  try {
    report.A = await dns.resolve4(domain);
  } catch (error) {
    // A 레코드가 없는 경우
  }

  try {
    report.CNAME = await dns.resolveCname(domain);
  } catch (error) {
    // CNAME 레코드가 없는 경우
  }

  try {
    const txtRecords = await dns.resolveTxt(domain);
    report.TXT = txtRecords.flat();
  } catch (error) {
    // TXT 레코드가 없는 경우
  }

  if (report.CNAME.length === 0 && report.A.length === 0) {
    report.advice.push("A 또는 CNAME 레코드가 없음 → Vercel 안내대로 추가");
  }

  report.advice.push("SSL은 Vercel 자동 발급. Pending이면 1~30분 대기");
  report.advice.push("전파 느리면 TTL=300으로 낮추고 재시도");

  console.log(JSON.stringify(report, null, 2));
})();

