'use client'

import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Terminal, 
  Settings, 
  Download, 
  Copy,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Bug,
  Clock,
  FileText,
  RotateCcw,
  AlertCircle,
  Monitor,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { cn, getLanguageConfig, getStatusColor, getStatusLabel, LANGUAGES, THEMES } from '@/lib/utils'

interface TestCase {
  input: string
  expected_output: string
  is_hidden: boolean
  explanation?: string
}

export default function IDEPage() {
  const params = useParams()
  const router = useRouter()
  const problemId = params.problemId as string

  const [problem, setProblem] = useState<any>(null)
  const [code, setCode] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('python')
  const [theme, setTheme] = useState('vs-dark')
  const [output, setOutput] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error' | 'submitted'>('idle')
  const [executionTime, setExecutionTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<any>(null)
  const [showTerminal, setShowTerminal] = useState(true)
  const [terminalHeight, setTerminalHeight] = useState(200)
  const [testCases, setTestCases] = useState<TestCase[]>([])
  const [results, setResults] = useState<any[]>([])
  const [useCustomStdin, setUseCustomStdin] = useState(false)
  const [customStdin, setCustomStdin] = useState('')
  const [showStdinInput, setShowStdinInput] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [mobileTab, setMobileTab] = useState<string>('theory')

  useEffect(() => {
    const fetchProblem = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('problems')
        .select('*, lesson:lessons(course:courses(slug))')
        .eq('id', problemId)
        .single()
      
      if (data) {
        setProblem(data)
        setCode(data.starter_code || '')
        setTestCases(data.test_cases_json || [])
      }
    }
    fetchProblem()
  }, [problemId])

  const handleRun = async () => {
    if (isRunning || !code.trim()) return
    
    setIsRunning(true)
    setStatus('running')
    setError('')
    setOutput('')
    setResults([])

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language: selectedLanguage,
          testCases: testCases.filter(tc => !tc.is_hidden),
          stdin: useCustomStdin ? customStdin : undefined,
        }),
      })

      const data = await response.json()
      
      if (data.results) {
        setResults(data.results)
        setStatus(data.overallStatus === 'AC' ? 'success' : 'error')
        setOutput(data.results.map((r: any) => 
          `Test ${r.testCaseIndex + 1}: ${r.status}\nInput: ${r.input}\nExpected: ${r.expectedOutput}\nActual: ${r.actualOutput}\n`
        ).join('\n---\n'))
      } else {
        setOutput(data.output)
        setError(data.error)
        setExecutionTime(data.executionTime)
        setStatus(data.status === 'AC' ? 'success' : 'error')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Execution failed')
      setStatus('error')
    } finally {
      setIsRunning(false)
    }
  }

  const handleSubmit = async () => {
    if (isSubmitting || !code.trim()) return
    
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login?callbackUrl=' + encodeURIComponent(window.location.pathname))
      return
    }

    setIsSubmitting(true)
    setStatus('submitted')

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language: selectedLanguage,
          testCases: testCases,
          stdin: useCustomStdin ? customStdin : undefined,
        }),
      })

      const data = await response.json()
      
      const overallStatus = data.overallStatus || 'WA'
      const passedCount = data.passedCount || 0
      const totalCount = data.totalCount || 0

      const { data: submission } = await supabase
        .from('submissions')
        .insert({
          user_id: user.id,
          problem_id: problemId,
          code,
          language: selectedLanguage,
          status: overallStatus,
          execution_time: Math.round(data.results?.[0]?.executionTime || 0),
        })
        .select()
        .single()

      setSubmissionResult({
        status: overallStatus,
        passedCount,
        totalCount,
        results: data.results,
        submissionId: submission?.id,
      })
      
      setStatus(overallStatus === 'AC' ? 'success' : 'error')
      
      if (overallStatus === 'AC') {
        await supabase.rpc('update_streak', { user_id: user.id })
      }
    } catch (err) {
      console.error('Submission error:', err)
      setStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${problem?.title?.replace(/\s+/g, '-')}.${getLanguageConfig(selectedLanguage).monacoLang}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const config = getLanguageConfig(selectedLanguage)

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 flex items-center px-4">
        <h1 className="text-lg font-bold text-white truncate flex-1">{problem.title}</h1>
      </header>

      <div className="flex flex-1 pt-16 lg:pt-0 overflow-hidden">
        <aside className="hidden lg:block lg:w-96 bg-gray-900 border-r border-gray-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className={cn('text-xs', getStatusColor(problem.difficulty))}>
                {problem.difficulty}
              </Badge>
              <span className="text-xs text-gray-400">Problem</span>
            </div>
            <h1 className="text-xl font-bold text-white">{problem.title}</h1>
          </div>

          <Tabs defaultValue="description" className="flex-1 overflow-hidden">
            <TabsList className="bg-gray-900 border-b border-gray-800 p-1">
              <TabsTrigger value="description" className="px-3 py-1.5 text-xs">
                <FileText className="h-3 w-3 mr-1" /> Description
              </TabsTrigger>
              <TabsTrigger value="testcases" className="px-3 py-1.5 text-xs">
                <Terminal className="h-3 w-3 mr-1" /> Test Cases
              </TabsTrigger>
              <TabsTrigger value="submissions" className="px-3 py-1.5 text-xs">
                <Clock className="h-3 w-3 mr-1" /> Submissions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="p-4 overflow-y-auto flex-1">
              <div className="prose prose-invert max-w-none text-sm">
                {problem.description}
              </div>
            </TabsContent>

            <TabsContent value="testcases" className="p-4 overflow-y-auto flex-1">
              <div className="space-y-3">
                {testCases.filter(tc => !tc.is_hidden).map((tc, index) => (
                  <Card key={index} className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-white">Test Case {index + 1}</span>
                        <Badge variant="outline" className="text-xs">Public</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-400">Input:</span>
                          <pre className="mt-1 text-white font-mono whitespace-pre-wrap">{tc.input}</pre>
                        </div>
                        <div>
                          <span className="text-gray-400">Expected:</span>
                          <pre className="mt-1 text-green-300 font-mono whitespace-pre-wrap">{tc.expected_output}</pre>
                        </div>
                      </div>
                      {tc.explanation && (
                        <p className="mt-2 text-xs text-gray-500">{tc.explanation}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {testCases.some(tc => tc.is_hidden) && (
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-3 text-center text-gray-500 text-sm">
                      <XCircle className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                      <p>Hidden test cases are run on submission</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="submissions" className="p-4 overflow-y-auto flex-1">
              <div className="text-center text-gray-500 py-8">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Your submissions will appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        </aside>

        {/* Mobile Tab Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-900 border-t border-gray-800">
          <Tabs defaultValue={mobileTab} onValueChange={setMobileTab} className="w-full">
            <TabsList className="grid grid-cols-3 bg-gray-900 border-b border-gray-800 p-1 w-full">
              <TabsTrigger value="theory" className="px-2 py-2 text-xs flex flex-col items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Theory</span>
              </TabsTrigger>
              <TabsTrigger value="editor" className="px-2 py-2 text-xs flex flex-col items-center gap-1">
                <Terminal className="h-4 w-4" />
                <span>Editor</span>
              </TabsTrigger>
              <TabsTrigger value="terminal" className="px-2 py-2 text-xs flex flex-col items-center gap-1">
                <Monitor className="h-4 w-4" />
                <span>Output</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                disabled={isRunning || isSubmitting}
                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id}>{lang.icon} {lang.name}</option>
                ))}
              </select>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                {THEMES.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCustomStdin}
                  onChange={(e) => {
                    setUseCustomStdin(e.target.checked)
                    setShowStdinInput(e.target.checked)
                  }}
                  disabled={isRunning || isSubmitting}
                  className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500 focus:ring-2"
                />
                <span>Custom Input (stdin)</span>
              </label>
              
              <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1">
                <Download className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(code)} className="gap-1">
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowResetConfirm(true)}
                className="gap-1 text-orange-400 border-orange-500/30 hover:bg-orange-500/10"
              >
                <RotateCcw className="h-3 w-3" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowTerminal(!showTerminal)} className="gap-1">
                {showTerminal ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
              </Button>
              <Button
                onClick={handleRun}
                disabled={isRunning || isSubmitting}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0 gap-1"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3" />
                    Run
                  </>
                )}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isRunning || isSubmitting}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 gap-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Bug className="h-3 w-3" />
                    Submit
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex-1 relative" style={{ height: showTerminal ? `calc(100% - ${terminalHeight}px)` : '100%' }}>
            <Editor
              height="100%"
              language={config.monacoLang}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme={theme}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                bracketPairColorization: { enabled: true },
                renderLineHighlight: 'all',
              }}
            />
          </div>

          {showStdinInput && (
            <div className="border-t border-gray-800 bg-gray-950 resize-y overflow-hidden" style={{ minHeight: '100px', maxHeight: '300px' }}>
              <div className="flex items-center justify-between px-3 py-2 bg-gray-900 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-gray-400" />
                  <span className="text-xs font-medium text-white">Custom Input (stdin)</span>
                </div>
                <button
                  onClick={() => setShowStdinInput(false)}
                  className="text-gray-500 hover:text-white text-sm px-2 py-1 rounded hover:bg-gray-800"
                >
                  Close
                </button>
              </div>
              <textarea
                value={customStdin}
                onChange={(e) => setCustomStdin(e.target.value)}
                placeholder="Enter custom input for your program..."
                className="w-full h-full p-3 font-mono text-sm text-white bg-gray-900 border-none resize-none focus:outline-none placeholder:text-gray-500"
                spellCheck={false}
              />
            </div>
          )}

          {showTerminal && (
            <div 
              className="border-t border-gray-800 bg-black/50 resize-y overflow-hidden"
              style={{ height: `${terminalHeight}px`, minHeight: '100px', maxHeight: '500px' }}
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                  const startY = e.clientY
                  const startHeight = terminalHeight
                  const onMouseMove = (e: MouseEvent) => {
                    setTerminalHeight(Math.max(100, Math.min(500, startHeight + startY - e.clientY)))
                  }
                  const onMouseUp = () => {
                    document.removeEventListener('mousemove', onMouseMove)
                    document.removeEventListener('mouseup', onMouseUp)
                  }
                  document.addEventListener('mousemove', onMouseMove)
                  document.addEventListener('mouseup', onMouseUp)
                }
              }}
            >
              <div className="flex items-center justify-between px-3 py-2 bg-gray-900 border-b border-gray-800 cursor-row-resize">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-gray-400" />
                  <span className="text-xs font-medium text-white">Terminal</span>
                  {status !== 'idle' && (
                    <Badge 
                      variant={status === 'success' ? 'success' : status === 'error' ? 'destructive' : 'outline'}
                      className="text-xs"
                    >
                      {status === 'running' && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                      {status === 'submitted' && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                      {getStatusLabel(status)}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-gray-500 font-mono">
                  {executionTime > 0 && `${executionTime.toFixed(2)}s`}
                </span>
              </div>
              <div className="h-full overflow-y-auto p-3 font-mono text-sm">
                {submissionResult && (
                  <div className="mb-4 p-3 rounded-lg bg-gray-800 border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant={submissionResult.status === 'AC' ? 'success' : 'destructive'}
                        className="text-sm"
                      >
                        {submissionResult.status === 'AC' ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Accepted
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            {getStatusLabel(submissionResult.status)}
                          </>
                        )}
                      </Badge>
                      <span className="text-sm text-gray-300">
                        {submissionResult.passedCount}/{submissionResult.totalCount} tests passed
                      </span>
                    </div>
                    {submissionResult.results && submissionResult.results.map((r: any, i: number) => (
                      <div key={i} className="text-xs font-mono text-gray-400">
                        Test {r.testCaseIndex + 1}: <span className={cn(
                          r.status === 'AC' && 'text-green-400',
                          r.status !== 'AC' && 'text-red-400'
                        )}>
                          {r.status}
                        </span>
                        {r.isHidden && <span className="ml-2 text-gray-500">(hidden)</span>}
                      </div>
                    ))}
                  </div>
                )}
                <pre className="whitespace-pre-wrap word-break-break-all">
                  <code className={cn(
                    error && !submissionResult ? 'text-red-300' : 'text-green-300'
                  )}>
                    {output || error || '// Run your code to see output...'}
                  </code>
                </pre>
              </div>
            </div>
          )}

        </main>
      </div>

    {showResetConfirm && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <AlertCircle className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Reset to Boilerplate?</h3>
              <p className="text-sm text-gray-400">This will discard all your changes and restore the original starter code.</p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowResetConfirm(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                setCode(problem?.starter_code || '')
                setShowResetConfirm(false)
              }}
            >
              Reset Code
            </Button>
          </div>
        </div>
      </div>
    )}
    </div>
  )
}