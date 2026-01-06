import { useEffect, useState } from 'react'

interface TopStory {
  story_id: number
  title: string
  opens: number
}

export default function Analytics() {
  const [topStories, setTopStories] = useState<TopStory[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAnalytics = () => {
    fetch('/api/analytics/top-stories')
      .then((res) => res.json())
      .then((data) => {
        setTopStories(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch analytics:', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchAnalytics()
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchAnalytics, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="analytics-page">
      <h2>Analytics Dashboard</h2>
      <p className="analytics-subtitle">Story opens (auto-refreshes every 5s)</p>

      {loading ? (
        <p className="loading">Loading analytics...</p>
      ) : topStories.length === 0 ? (
        <p className="no-data">No data yet. Open some stories to see analytics!</p>
      ) : (
        <table className="analytics-table">
          <thead>
            <tr>
              <th>Story</th>
              <th>Opens</th>
            </tr>
          </thead>
          <tbody>
            {topStories.map((story) => (
              <tr key={story.story_id}>
                <td>{story.title}</td>
                <td className="opens-count">{story.opens}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
