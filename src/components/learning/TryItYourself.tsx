'use client'

import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, CheckCircle, XCircle, Loader2, Terminal, Copy, Maximize2 } from 'lucide-react'
import { getLanguageConfig, LANGUAGES } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface TryItYourselfProps {
  initialCode: string
  language?: string
  readonly?: boolean
  height?: number
  onRun?: (code: string, language: string) => Promise<{ output: string; error?: string; executionTime: number }>
}

export function TryItYourself({ 
  initialCode, 
  language = 'python',
  readonly = false,
  height = 300,
  onRun
}: TryItYourselfProps) {
  const [code, setCode] = useState(initialCode)
  const [selectedLanguage, setSelectedLanguage] = useState(language)
  const [output, setOutput] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isRunning, setIsRunning] = useState(false)
  const [executionTime, setExecutionTime] = useState(0)
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle')

  const handleRun = async () => {
    if (!onRun || isRunning) return
    
    setIsRunning(true)
    setStatus('running')
    setError('')
    
    try {
      const result = await onRun(code, selectedLanguage)
      setOutput(result.output)
      setExecutionTime(result.executionTime)
      if (result.error) {
        setError(result.error)
        setStatus('error')
      } else {
        setStatus('success')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Execution failed')
      setStatus('error')
    } finally {
      setIsRunning(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
  }

  const config = getLanguageConfig(selectedLanguage)

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-950">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            disabled={readonly || isRunning}
            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-purple-500"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>{lang.icon} {lang.name}</option>
            ))}
          </select>
          {readonly && (
            <Badge variant="outline" className="text-xs">Readonly</Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-1"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
          >
            <Maximize2 className="h-3 w-3" />
          </Button>
          <Button
            onClick={handleRun}
            disabled={isRunning || readonly}
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
        </div>
      </div>

      {/* Editor */}
      <div className="relative" style={{ height: `${height}px` }}>
        <Editor
          height="100%"
          language={config.monacoLang}
          value={code}
          onChange={readonly ? undefined : (value) => setCode(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            readOnly: readonly,
          }}
        />
      </div>

      {/* Output Terminal */}
      {(output || error) && (
        <div className="border-t border-gray-700 bg-black/50">
          <div className="flex items-center justify-between px-3 py-2 bg-gray-900">
            <Terminal className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-400">Output</span>
            <div className="flex items-center gap-2">
              <Badge 
                variant={status === 'success' ? 'success' : 'destructive'}
                className="text-xs"
              >
                {status === 'success' ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Success
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 mr-1" />
                    Error
                  </>
                )}
              </Badge>
              <span className="text-xs text-gray-500 font-mono">
                {executionTime.toFixed(2)}s
              </span>
            </div>
          </div>
          <pre className="p-4 text-sm font-mono max-h-64 overflow-y-auto">
            <code className={cn(
              status === 'success' ? 'text-green-300' : 'text-red-300',
              'whitespace-pre-wrap word-break-break-all'
            )}>
              {error || output}
            </code>
          </pre>
        </div>
      )}
    </div>
  )
}