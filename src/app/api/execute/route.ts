import { NextRequest, NextResponse } from 'next/server'

const PISTON_API_URL = process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston/execute'

const languageMap: Record<string, { language: string; version: string }> = {
  python: { language: 'python', version: '3.10.0' },
  javascript: { language: 'javascript', version: '18.15.0' },
  typescript: { language: 'typescript', version: '5.0.3' },
  cpp: { language: 'cpp', version: '10.2.0' },
  c: { language: 'c', version: '10.2.0' },
  java: { language: 'java', version: '15.0.2' },
  go: { language: 'go', version: '1.16.2' },
  rust: { language: 'rust', version: '1.68.2' },
}

export async function POST(request: NextRequest) {
  try {
    const { code, language, testCases, stdin } = await request.json()

    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      )
    }

    const langConfig = languageMap[language]
    if (!langConfig) {
      return NextResponse.json(
        { error: `Unsupported language: ${language}` },
        { status: 400 }
      )
    }

    // If test cases provided, run against all of them
    if (testCases && testCases.length > 0) {
      const results = await Promise.all(
        testCases.map(async (testCase: { input: string; expected_output: string; is_hidden: boolean }, index: number) => {
          const response = await fetch(PISTON_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              language: langConfig.language,
              version: langConfig.version,
              files: [{ content: code }],
              stdin: testCase.input,
            }),
          })

          const data = await response.json()
          
          const output = data.run?.stdout || ''
          const stderr = data.run?.stderr || ''
          const exitCode = data.run?.code ?? -1
          const executionTime = data.run?.time || 0

          let status: 'AC' | 'WA' | 'TLE' | 'CE' | 'RE' = 'WA'
          
          if (exitCode !== 0) {
            if (stderr.includes('timeout') || executionTime > 2000) {
              status = 'TLE'
            } else if (stderr.includes('compilation') || stderr.includes('SyntaxError') || stderr.includes('error:')) {
              status = 'CE'
            } else {
              status = 'RE'
            }
          } else if (output.trim() === testCase.expected_output.trim()) {
            status = 'AC'
          }

          return {
            testCaseIndex: index,
            input: testCase.input,
            expectedOutput: testCase.expected_output,
            actualOutput: output.trim(),
            status,
            executionTime,
            error: stderr,
            isHidden: testCase.is_hidden,
          }
        })
      )

      const allPassed = results.every(r => r.status === 'AC')
      const hasError = results.some(r => r.status !== 'AC' && r.status !== 'WA')
      
      return NextResponse.json({
        results,
        overallStatus: allPassed ? 'AC' : hasError ? results.find(r => r.status !== 'AC' && r.status !== 'WA')?.status || 'WA' : 'WA',
        passedCount: results.filter(r => r.status === 'AC').length,
        totalCount: results.length,
      })
    }

    // Single execution
    const response = await fetch(PISTON_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: langConfig.language,
        version: langConfig.version,
        files: [{ content: code }],
        stdin: stdin || '',
      }),
    })

    const data = await response.json()
    
    const output = data.run?.stdout || ''
    const stderr = data.run?.stderr || ''
    const exitCode = data.run?.code ?? -1
    const executionTime = data.run?.time || 0

    let status: 'AC' | 'WA' | 'TLE' | 'CE' | 'RE' = 'AC'
    
    if (exitCode !== 0) {
      if (stderr.includes('timeout') || executionTime > 2000) {
        status = 'TLE'
      } else if (stderr.includes('compilation') || stderr.includes('SyntaxError') || stderr.includes('error:')) {
        status = 'CE'
      } else {
        status = 'RE'
      }
    }

    return NextResponse.json({
      output: output.trim(),
      error: stderr,
      status,
      executionTime,
    })
  } catch (error) {
    console.error('Execution error:', error)
    return NextResponse.json(
      { error: 'Execution failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}