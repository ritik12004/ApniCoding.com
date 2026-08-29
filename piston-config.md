# ============================================
# PISTON API CONFIGURATION
# ============================================
# For self-hosted Piston API (https://github.com/engineer-man/piston)
# If using public instance (emkc.org), CORS is already configured

# ============================================
# DOCKER COMPOSE FOR SELF-HOSTED PISTON
# ============================================
# docker-compose.piston.yml
version: '3.8'

services:
  piston:
    image: engineer/piston:latest
    container_name: piston-api
    ports:
      - "2000:2000"
    environment:
      - PORT=2000
      - COMPILE_TIMEOUT=10000
      - RUN_TIMEOUT=3000
      - MEMORY_LIMIT=100000
      - OUTPUT_LIMIT=10000
      - CORS_ORIGIN=*
      - RATE_LIMIT_WINDOW_MS=60000
      - RATE_LIMIT_MAX_REQUESTS=30
    volumes:
      - piston-data:/piston
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:2000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  piston-data:

# ============================================
# PISTON API CLIENT CONFIGURATION
# ============================================
# src/lib/piston.ts
# Rate limiting and CORS handling for client-side calls

/*
import { PISTON_API_URL } from '@/lib/utils';

interface PistonRequest {
  code: string;
  language: string;
  testCases?: Array<{ input: string; expected_output: string; is_hidden: boolean }>;
  stdin?: string;
}

interface PistonResponse {
  output?: string;
  error?: string;
  status: 'AC' | 'WA' | 'TLE' | 'CE' | 'RE';
  executionTime: number;
  memoryUsed?: number;
}

export async function executeCode(request: PistonRequest): Promise<PistonResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35000); // 35s timeout

  try {
    const response = await fetch(PISTON_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: getLanguageConfig(request.language).pistonLang,
        version: getLanguageConfig(request.language).pistonVersion,
        files: [{ content: request.code }],
        stdin: request.stdin || '',
        ...(request.testCases && { testCases: request.testCases })
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Piston API error: ${response.status}`);
    }

    const data = await response.json();
    return processPistonResponse(data, request.testCases);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        output: '',
        error: 'Execution timeout (35s)',
        status: 'TLE',
        executionTime: 35000,
      };
    }
    throw error;
  }
}

function processPistonResponse(data: any, testCases?: Array<any>): PistonResponse {
  if (data.run) {
    // Single execution
    const output = data.run.stdout || '';
    const stderr = data.run.stderr || '';
    const exitCode = data.run.code ?? -1;
    const executionTime = data.run.time || 0;

    let status: PistonResponse['status'] = 'AC';
    if (exitCode !== 0) {
      if (stderr.includes('timeout') || executionTime > 3000) status = 'TLE';
      else if (stderr.includes('compilation') || stderr.includes('SyntaxError')) status = 'CE';
      else status = 'RE';
    }

    return { output, error: stderr, status, executionTime };
  }

  // Test case execution
  if (data.runs && Array.isArray(data.runs)) {
    const results = data.runs.map((run: any, index: number) => {
      const tc = testCases?.[index];
      const output = run.stdout || '';
      const stderr = run.stderr || '';
      const exitCode = run.code ?? -1;
      const executionTime = run.time || 0;

      let status: PistonResponse['status'] = 'WA';
      if (exitCode !== 0) {
        if (stderr.includes('timeout') || executionTime > 3000) status = 'TLE';
        else if (stderr.includes('compilation') || stderr.includes('SyntaxError')) status = 'CE';
        else status = 'RE';
      } else if (tc && output.trim() === tc.expected_output.trim()) {
        status = 'AC';
      }

      return {
        testCaseIndex: index,
        input: tc?.input || '',
        expectedOutput: tc?.expected_output || '',
        actualOutput: output.trim(),
        status,
        executionTime,
        error: stderr,
        isHidden: tc?.is_hidden || false,
      };
    });

    const allPassed = results.every((r: any) => r.status === 'AC');
    const hasError = results.some((r: any) => r.status !== 'AC' && r.status !== 'WA');

    return {
      results,
      overallStatus: allPassed ? 'AC' : hasError ? results.find((r: any) => r.status !== 'AC' && r.status !== 'WA')?.status || 'WA' : 'WA',
      passedCount: results.filter((r: any) => r.status === 'AC').length,
      totalCount: results.length,
    };
  }

  return { output: '', error: 'Unknown response format', status: 'RE', executionTime: 0 };
}
*/

# ============================================
# CORS HEADERS FOR PRODUCTION
# ============================================
# Add to your Piston API server (if self-hosted):
# Access-Control-Allow-Origin: https://yourdomain.com
# Access-Control-Allow-Methods: POST, OPTIONS
# Access-Control-Allow-Headers: Content-Type, Authorization
# Access-Control-Max-Age: 86400

# ============================================
# RATE LIMITING CONFIGURATION
# ============================================
# Environment variables for Piston:
# RATE_LIMIT_WINDOW_MS=60000    # 1 minute window
# RATE_LIMIT_MAX_REQUESTS=30    # 30 requests per minute per IP
# For higher limits, use Redis-backed rate limiter