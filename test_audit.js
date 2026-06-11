const { getAuditLogs } = require('./gestao_conecta/src/actions/audit');

async function test() {
  const result = await getAuditLogs({ page: 1, limit: 10 });
  console.log("Result:");
  console.dir(result, { depth: null });
}

test().catch(console.error);
