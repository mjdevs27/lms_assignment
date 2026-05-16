import dotenv from 'dotenv';
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:5000';

interface LoginResponse {
  success: boolean;
  data?: {
    token?: string;
    accessToken?: string;
  };
  token?: string;
  accessToken?: string;
}

interface CheckResult {
  role: string;
  route: string;
  expected: number;
  actual: number;
  pass: boolean;
}

const SEED_CREDENTIALS = [
  { role: 'ADMIN', email: 'admin@lms.com', password: 'Password@123' },
  { role: 'SALES', email: 'sales@lms.com', password: 'Password@123' },
  { role: 'SANCTION', email: 'sanction@lms.com', password: 'Password@123' },
  { role: 'DISBURSEMENT', email: 'disbursement@lms.com', password: 'Password@123' },
  { role: 'COLLECTION', email: 'collection@lms.com', password: 'Password@123' },
  { role: 'BORROWER', email: 'borrower@lms.com', password: 'Password@123' },
];

const ROUTES = [
  { name: 'GET /api/borrower/profile', path: '/api/borrower/profile', method: 'GET' },
  { name: 'GET /api/dashboard/sales/leads', path: '/api/dashboard/sales/leads', method: 'GET' },
  {
    name: 'GET /api/dashboard/sanction/loans',
    path: '/api/dashboard/sanction/loans',
    method: 'GET',
  },
  {
    name: 'GET /api/dashboard/disbursement/loans',
    path: '/api/dashboard/disbursement/loans',
    method: 'GET',
  },
  {
    name: 'GET /api/dashboard/collection/loans',
    path: '/api/dashboard/collection/loans',
    method: 'GET',
  },
];

// Expected status codes per role per route
// 200 means allowed (or 200 with empty data), 403 means forbidden
const EXPECTED_ACCESS: Record<string, Record<string, number>> = {
  ADMIN: {
    'GET /api/borrower/profile': 403,
    'GET /api/dashboard/sales/leads': 200,
    'GET /api/dashboard/sanction/loans': 200,
    'GET /api/dashboard/disbursement/loans': 200,
    'GET /api/dashboard/collection/loans': 200,
  },
  SALES: {
    'GET /api/borrower/profile': 403,
    'GET /api/dashboard/sales/leads': 200,
    'GET /api/dashboard/sanction/loans': 403,
    'GET /api/dashboard/disbursement/loans': 403,
    'GET /api/dashboard/collection/loans': 403,
  },
  SANCTION: {
    'GET /api/borrower/profile': 403,
    'GET /api/dashboard/sales/leads': 403,
    'GET /api/dashboard/sanction/loans': 200,
    'GET /api/dashboard/disbursement/loans': 403,
    'GET /api/dashboard/collection/loans': 403,
  },
  DISBURSEMENT: {
    'GET /api/borrower/profile': 403,
    'GET /api/dashboard/sales/leads': 403,
    'GET /api/dashboard/sanction/loans': 403,
    'GET /api/dashboard/disbursement/loans': 200,
    'GET /api/dashboard/collection/loans': 403,
  },
  COLLECTION: {
    'GET /api/borrower/profile': 403,
    'GET /api/dashboard/sales/leads': 403,
    'GET /api/dashboard/sanction/loans': 403,
    'GET /api/dashboard/disbursement/loans': 403,
    'GET /api/dashboard/collection/loans': 200,
  },
  BORROWER: {
    'GET /api/borrower/profile': 200,
    'GET /api/dashboard/sales/leads': 403,
    'GET /api/dashboard/sanction/loans': 403,
    'GET /api/dashboard/disbursement/loans': 403,
    'GET /api/dashboard/collection/loans': 403,
  },
};

async function loginUser(email: string, password: string): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const body = (await response.json()) as LoginResponse;

    const token =
      body?.data?.token ??
      body?.data?.accessToken ??
      body?.token ??
      body?.accessToken ??
      null;

    return token ?? null;
  } catch {
    return null;
  }
}

async function checkRoute(
  token: string,
  method: string,
  path: string,
): Promise<number> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.status;
  } catch {
    return 0;
  }
}

function padRight(str: string, len: number): string {
  return str.length >= len ? str : str + ' '.repeat(len - str.length);
}

async function runRbacTests(): Promise<void> {
  console.log('RBAC Matrix Test');
  console.log('='.repeat(70));
  console.log(`Backend URL: ${API_BASE_URL}`);
  console.log('');

  // Login all users
  const tokens: Record<string, string> = {};
  console.log('Logging in seed users...');
  for (const cred of SEED_CREDENTIALS) {
    const token = await loginUser(cred.email, cred.password);
    if (!token) {
      console.error(`FAIL: Could not login ${cred.email}. Ensure the backend is running and seed users exist.`);
      process.exit(1);
    }
    tokens[cred.role] = token;
    console.log(`  Logged in: ${cred.email} [${cred.role}]`);
  }

  console.log('');
  console.log('Running authorization checks...');
  console.log('');

  const results: CheckResult[] = [];

  for (const cred of SEED_CREDENTIALS) {
    const token = tokens[cred.role];
    for (const route of ROUTES) {
      const expected = EXPECTED_ACCESS[cred.role][route.name] ?? -1;
      const actual = await checkRoute(token, route.method, route.path);
      const pass = actual === expected || (expected === 200 && actual >= 200 && actual < 300);
      results.push({
        role: cred.role,
        route: route.name,
        expected,
        actual,
        pass,
      });
    }
  }

  // Print results table
  const colRole = 14;
  const colRoute = 42;
  const colExp = 10;
  const colAct = 10;
  const colRes = 8;

  const header =
    padRight('Role', colRole) +
    padRight('Route', colRoute) +
    padRight('Expected', colExp) +
    padRight('Actual', colAct) +
    'Result';

  console.log(header);
  console.log('-'.repeat(colRole + colRoute + colExp + colAct + colRes));

  for (const r of results) {
    const line =
      padRight(r.role, colRole) +
      padRight(r.route, colRoute) +
      padRight(String(r.expected), colExp) +
      padRight(String(r.actual), colAct) +
      (r.pass ? 'PASS' : 'FAIL');
    console.log(line);
  }

  const total = results.length;
  const passed = results.filter((r) => r.pass).length;
  const failed = total - passed;

  console.log('');
  console.log('='.repeat(70));
  console.log(`Results: ${passed}/${total} passed, ${failed} failed`);
  console.log('');

  // Additional summary: unauthenticated check
  console.log('Checking unauthenticated access (no token)...');
  const noTokenStatus = await (async () => {
    try {
      const r = await fetch(`${API_BASE_URL}/api/dashboard/sales/leads`);
      return r.status;
    } catch {
      return 0;
    }
  })();
  const noTokenPass = noTokenStatus === 401;
  console.log(
    `  No token -> /api/dashboard/sales/leads: ${noTokenStatus} ${noTokenPass ? '(PASS - expected 401)' : '(FAIL - expected 401)'}`,
  );

  console.log('Checking invalid token access...');
  const invalidTokenStatus = await (async () => {
    try {
      const r = await fetch(`${API_BASE_URL}/api/dashboard/sales/leads`, {
        headers: { Authorization: 'Bearer invalid.token.here' },
      });
      return r.status;
    } catch {
      return 0;
    }
  })();
  const invalidTokenPass = invalidTokenStatus === 401;
  console.log(
    `  Invalid token -> /api/dashboard/sales/leads: ${invalidTokenStatus} ${invalidTokenPass ? '(PASS - expected 401)' : '(FAIL - expected 401)'}`,
  );

  console.log('');

  if (failed > 0 || !noTokenPass || !invalidTokenPass) {
    console.log('RBAC test FAILED. Review the output above for failures.');
    process.exit(1);
  } else {
    console.log('All RBAC checks passed.');
    process.exit(0);
  }
}

runRbacTests().catch((error) => {
  console.error('RBAC test script encountered an error:', error);
  process.exit(1);
});
