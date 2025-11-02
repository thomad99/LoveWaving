'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface HealthStatus {
  status: string
  timestamp: string
  checks: {
    database: {
      status: string
      connected: boolean
      error: string | null
      stats: {
        totalUsers?: number
        totalEvents?: number
        totalWaivers?: number
        totalSignatures?: number
        activeEvents?: number
        recentSignatures24h?: number
        adminUsers?: number
      }
    }
    s3: {
      status: string
      accessible: boolean
      error: string | null
      stats: {
        bucketName?: string
        region?: string
        configured?: boolean
        documentCount?: number
      }
    }
  }
}

export default function HealthPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [debugLoading, setDebugLoading] = useState(false)

  const fetchHealth = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/health')
      if (!response.ok) {
        throw new Error('Failed to fetch health status')
      }
      const data = await response.json()
      setHealth(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setHealth(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchDebugInfo = async () => {
    setDebugLoading(true)
    try {
      const response = await fetch('/api/debug')
      const data = await response.json()
      setDebugInfo(data)
    } catch (err) {
      setDebugInfo({ error: 'Failed to fetch debug info' })
    } finally {
      setDebugLoading(false)
    }
  }

  const testDatabase = async () => {
    setDebugLoading(true)
    try {
      const response = await fetch('/api/debug?action=test-db')
      const data = await response.json()
      setDebugInfo(data)
    } catch (err) {
      setDebugInfo({ error: 'Failed to test database' })
    } finally {
      setDebugLoading(false)
    }
  }

  useEffect(() => {
    fetchHealth()
    // Refresh every 30 seconds
    const interval = setInterval(fetchHealth, 30000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ok':
        return <Badge variant="default" className="bg-green-600">Operational</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      case 'degraded':
        return <Badge className="bg-yellow-600">Degraded</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">System Health Check</h1>
          <p className="text-gray-600 text-sm md:text-base">
            Monitor LoveWaving system status and statistics
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <Button onClick={fetchHealth} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh Status'}
            </Button>
            <Button onClick={testDatabase} disabled={debugLoading} variant="outline">
              {debugLoading ? 'Testing...' : 'Test Database'}
            </Button>
            <Button onClick={fetchDebugInfo} disabled={debugLoading} variant="outline">
              {debugLoading ? 'Loading...' : 'Debug Info'}
            </Button>
          </div>
          {health && (
            <span className="text-sm text-gray-500">
              Last updated: {new Date(health.timestamp).toLocaleString()}
            </span>
          )}
        </div>

        {debugInfo && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle>Debug Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <pre className="text-xs bg-white p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800">Error: {error}</p>
            </CardContent>
          </Card>
        )}

        {loading && !health && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading health status...</p>
          </div>
        )}

        {health && (
          <div className="space-y-6">
            {/* Overall Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Overall Status</CardTitle>
                  {getStatusBadge(health.status)}
                </div>
              </CardHeader>
            </Card>

            {/* Database Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Database Status</CardTitle>
                    <CardDescription>PostgreSQL connection and statistics</CardDescription>
                  </div>
                  {getStatusBadge(health.checks.database.status)}
                </div>
              </CardHeader>
              <CardContent>
                {health.checks.database.connected ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-600">
                        {health.checks.database.stats.totalUsers || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Users</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-600">
                        {health.checks.database.stats.adminUsers || 0}
                      </div>
                      <div className="text-sm text-gray-600">Admin Users</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-600">
                        {health.checks.database.stats.totalEvents || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Events</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-600">
                        {health.checks.database.stats.activeEvents || 0}
                      </div>
                      <div className="text-sm text-gray-600">Active Events</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-600">
                        {health.checks.database.stats.totalWaivers || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Waivers</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-600">
                        {health.checks.database.stats.totalSignatures || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Signatures</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-600">
                        {health.checks.database.stats.recentSignatures24h || 0}
                      </div>
                      <div className="text-sm text-gray-600">Last 24 Hours</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-red-600">
                    <p className="font-semibold">Database connection failed</p>
                    <p className="text-sm mt-2">{health.checks.database.error}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* S3 Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Cloud Storage Status</CardTitle>
                    <CardDescription>AWS S3 connection and configuration</CardDescription>
                  </div>
                  {getStatusBadge(health.checks.s3.status)}
                </div>
              </CardHeader>
              <CardContent>
                {health.checks.s3.accessible ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Bucket Name</div>
                        <div className="font-mono text-sm">
                          {health.checks.s3.stats.bucketName || 'Not configured'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Region</div>
                        <div className="font-mono text-sm">
                          {health.checks.s3.stats.region || 'Not configured'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Configuration</div>
                        <div>
                          {health.checks.s3.stats.configured ? (
                            <Badge variant="default" className="bg-green-600">Configured</Badge>
                          ) : (
                            <Badge variant="destructive">Not Configured</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-red-600">
                    <p className="font-semibold">S3 storage inaccessible</p>
                    <p className="text-sm mt-2">{health.checks.s3.error}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* System Info */}
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Environment</div>
                    <div className="font-mono text-sm">{process.env.NODE_ENV || 'unknown'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Health Check Endpoint</div>
                    <div className="font-mono text-sm">/api/health</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

