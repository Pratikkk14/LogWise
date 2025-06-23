import React, { useEffect } from 'react'
import {
  healthCheck,
  dashboardAPI,
  logsAPI,
  explainAPI,
} from '../../services/api'

export default function APITester() {
  useEffect(() => {
    async function runTests() {
      console.groupCollapsed('🔌 API Health Check')
      try {
        const ok = await healthCheck()
        console.log('healthCheck()', ok)
      } catch (err) {
        console.error('healthCheck() failed:', err)
      }
      console.groupEnd()

      console.groupCollapsed('🗂 DashboardAPI')
      try {
        const projects = await dashboardAPI.getProjects()
        console.log('getProjects():', projects)
      } catch (err) {
        console.error('getProjects() failed:', err)
      }
      try {
        const sessions = await dashboardAPI.getSessions()
        console.log('getSessions():', sessions)
      } catch (err) {
        console.error('getSessions() failed:', err)
      }
      try {
        const start = await dashboardAPI.startSession('some-project-id')
        console.log('startSession():', start)
      } catch (err) {
        console.error('startSession() failed:', err)
      }
      console.groupEnd()

      console.groupCollapsed('📜 LogsAPI')
      try {
        const logs = await logsAPI.getLogs()
        console.log('getLogs():', logs)
      } catch (err) {
        console.error('getLogs() failed:', err)
      }
      try {
        const recent = await logsAPI.getRecentLogs()
        console.log('getRecentLogs():', recent)
      } catch (err) {
        console.error('getRecentLogs() failed:', err)
      }
      try {
        const errors = await logsAPI.getErrorLogs()
        console.log('getErrorLogs():', errors)
      } catch (err) {
        console.error('getErrorLogs() failed:', err)
      }
      console.groupEnd()

      console.groupCollapsed('🤖 ExplainAPI')
      try {
        const explain = await explainAPI.explainLog(
          'example log message',
          'example project description'
        )
        console.log('explainLog():', explain)
      } catch (err) {
        console.error('explainLog() failed:', err)
      }
      console.groupEnd()
    }

    runTests()
  }, [])

  // This component does not render anything visible
  return null
}
