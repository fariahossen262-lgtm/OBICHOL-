import { useMemo, useState } from 'react'
import './App.css'

const sampleRecords = [
  {
    id: '1024',
    location: 'Savar, Dhaka',
    registrationOwner: 'Rahim Uddin',
    mutationOwner: 'Karim Ahmed',
    previousSale: 'Hasan Ali',
    transferDays: 12,
    duplicateSale: false,
  },
  {
    id: '2158',
    location: 'Narsingdi, Dhaka',
    registrationOwner: 'Momena Begum',
    mutationOwner: 'Shahjahan Ali',
    previousSale: 'Momena Begum',
    transferDays: 45,
    duplicateSale: false,
  },
  {
    id: '3156',
    location: 'Gazipur, Dhaka',
    registrationOwner: 'Abdul Karim',
    mutationOwner: 'Shahjahan Ali',
    previousSale: 'Abdul Karim',
    transferDays: 8,
    duplicateSale: true,
  },
  {
    id: '4207',
    location: 'Narshingdi, Dhaka',
    registrationOwner: 'Tania Akter',
    mutationOwner: 'Tania Akter',
    previousSale: 'Jamal Mia',
    transferDays: 90,
    duplicateSale: false,
  },
  {
    id: '5127',
    location: 'Cumilla, Chattogram',
    registrationOwner: 'Sajjad Hossain',
    mutationOwner: 'Rina Sultana',
    previousSale: 'Sajjad Hossain',
    transferDays: 18,
    duplicateSale: false,
  },
  {
    id: '6203',
    location: 'Rajshahi, Rajshahi',
    registrationOwner: 'Nusrat Jahan',
    mutationOwner: 'Nusrat Jahan',
    previousSale: 'Aminul Islam',
    transferDays: 450,
    duplicateSale: false,
  },
]

const riskToneClass = {
  High: 'risk-high',
  Medium: 'risk-medium',
  Low: 'risk-low',
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'land-search', label: 'Land Search' },
  { id: 'fraud-detection', label: 'Fraud Detection' },
  { id: 'risk-analysis', label: 'Risk Analysis' },
]

const formatRiskLabel = (riskLevel) => riskLevel.toUpperCase()

const evaluateRecordRisk = (record) => {
  const indicators = []
  const ownerMismatch =
    record.registrationOwner.trim().toLowerCase() !==
    record.mutationOwner.trim().toLowerCase()

  if (ownerMismatch) {
    indicators.push('Registration owner and mutation owner mismatch')
  }

  if (record.transferDays > 0 && record.transferDays <= 30) {
    indicators.push('Suspiciously short transfer interval')
  }

  if (record.duplicateSale) {
    indicators.push('Potential duplicate or conflicting sale record')
  }

  let riskLevel = 'Low'

  if (indicators.length >= 2 || (ownerMismatch && record.transferDays <= 14)) {
    riskLevel = 'High'
  } else if (indicators.length === 1) {
    riskLevel = 'Medium'
  }

  return {
    ...record,
    riskLevel,
    indicators,
  }
}

const recordsWithRisk = sampleRecords.map((record) => evaluateRecordRisk(record))

const getRiskSummary = (records) => ({
  High: records.filter((record) => record.riskLevel === 'High').length,
  Medium: records.filter((record) => record.riskLevel === 'Medium').length,
  Low: records.filter((record) => record.riskLevel === 'Low').length,
})

const riskSummary = getRiskSummary(recordsWithRisk)

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [searchId, setSearchId] = useState('')

  const matchedRecord = useMemo(() => {
    const normalized = searchId.trim()
    if (!normalized) {
      return null
    }

    return recordsWithRisk.find(
      (record) => record.id.toLowerCase() === normalized.toLowerCase(),
    )
  }, [searchId])

  const handleNavigation = (view) => {
    setActiveView(view)
  }

  const handleInspectRecord = (recordId) => {
    setSearchId(recordId)
    setActiveView('land-search')
  }

  const renderDashboard = () => (
    <section className="page-section">
      <div className="welcome-panel">
        <div>
          <p className="eyebrow">OBICHOL DATA MONITOR</p>
          <h1>Welcome to Obichol</h1>
          <p className="welcome-copy">
            Detect suspicious land transactions and identify potential ownership conflicts.
          </p>
        </div>
        <button
          type="button"
          className="primary-button"
          onClick={() => handleNavigation('fraud-detection')}
        >
          Run Fraud Analysis
        </button>
      </div>

      <div className="summary-grid">
        <SummaryCard label="Total Land Records" value={recordsWithRisk.length} tone="neutral" />
        <SummaryCard label="High Risk Cases" value={riskSummary.High} tone="high" />
        <SummaryCard label="Medium Risk Cases" value={riskSummary.Medium} tone="medium" />
        <SummaryCard label="Low Risk Cases" value={riskSummary.Low} tone="low" />
      </div>

      <div className="content-grid two-column">
        <div className="panel">
          <div className="panel-header">
            <h2>Recent Land Records</h2>
            <button type="button" className="ghost-button" onClick={() => handleNavigation('risk-analysis')}>
              View all
            </button>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Land ID</th>
                  <th>Location</th>
                  <th>Registration Owner</th>
                  <th>Mutation Owner</th>
                  <th>Risk Level</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recordsWithRisk.slice(0, 5).map((record) => (
                  <tr key={record.id}>
                    <td>{record.id}</td>
                    <td>{record.location}</td>
                    <td>{record.registrationOwner}</td>
                    <td>{record.mutationOwner}</td>
                    <td>
                      <span className={`risk-badge ${riskToneClass[record.riskLevel]}`}>
                        {record.riskLevel}
                      </span>
                    </td>
                    <td>
                      <button type="button" className="table-button" onClick={() => handleInspectRecord(record.id)}>
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Risk Distribution</h2>
          </div>
          <div className="distribution-list">
            {['High', 'Medium', 'Low'].map((level) => {
              const total = recordsWithRisk.length || 1
              const percentage = Math.round((riskSummary[level] / total) * 100)

              return (
                <div key={level} className="distribution-item">
                  <div className="distribution-label-row">
                    <span className={`risk-badge ${riskToneClass[level]}`}>{level}</span>
                    <strong>{percentage}%</strong>
                  </div>
                  <div className="distribution-bar-track">
                    <div
                      className={`distribution-bar ${riskToneClass[level]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <small>{riskSummary[level]} records</small>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )

  const renderLandSearch = () => (
    <section className="page-section">
      <div className="panel">
        <div className="panel-header">
          <h2>Land Search</h2>
        </div>

        <form className="search-form" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="land-id">Enter Land ID</label>
          <div className="search-row">
            <input
              id="land-id"
              type="text"
              value={searchId}
              onChange={(event) => setSearchId(event.target.value)}
              placeholder="e.g. 1024"
            />
          </div>
        </form>

        <div className="id-list">
          <span className="id-list-label">Sample IDs:</span>
          {recordsWithRisk.map((record) => (
            <button type="button" key={record.id} className="id-chip" onClick={() => setSearchId(record.id)}>
              {record.id}
            </button>
          ))}
        </div>

        {searchId.trim() === '' ? (
          <p className="empty-state">Search a land ID to inspect the record.</p>
        ) : matchedRecord ? (
          <div className="record-detail-card">
            <div className="record-header">
              <div>
                <p className="eyebrow">MATCHED RECORD</p>
                <h3>Land ID {matchedRecord.id}</h3>
              </div>
              <span className={`risk-badge ${riskToneClass[matchedRecord.riskLevel]}`}>
                {matchedRecord.riskLevel}
              </span>
            </div>

            <div className="detail-grid">
              <DetailItem label="Location" value={matchedRecord.location} />
              <DetailItem label="Registration Owner" value={matchedRecord.registrationOwner} />
              <DetailItem label="Mutation Owner" value={matchedRecord.mutationOwner} />
              <DetailItem label="Previous Sale Record" value={matchedRecord.previousSale} />
              <DetailItem label="Transfer Interval" value={`${matchedRecord.transferDays} days`} />
              <DetailItem label="Risk Level" value={matchedRecord.riskLevel} />
            </div>
          </div>
        ) : (
          <p className="empty-state">No land record matches the entered ID.</p>
        )}
      </div>
    </section>
  )

  const renderFraudDetection = () => (
    <section className="page-section">
      <div className="panel">
        <div className="panel-header">
          <h2>Preliminary Fraud Indicators</h2>
        </div>
        <p className="note-text">
          These checks are illustrative rule-based indicators for prototype analysis and do not prove fraud.
        </p>

        <div className="analysis-list">
          {recordsWithRisk.map((record) => (
            <div key={record.id} className="analysis-card">
              <div className="record-header">
                <div>
                  <p className="eyebrow">LAND {record.id}</p>
                  <h3>{record.location}</h3>
                </div>
                <span className={`risk-badge ${riskToneClass[record.riskLevel]}`}>
                  {formatRiskLabel(record.riskLevel)}
                </span>
              </div>

              <ul className="indicator-list">
                {record.indicators.length > 0 ? (
                  record.indicators.map((indicator) => <li key={indicator}>{indicator}</li>)
                ) : (
                  <li>No triggered indicators for this record.</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  const renderRiskAnalysis = () => (
    <section className="page-section">
      <div className="panel">
        <div className="panel-header">
          <h2>Risk Analysis</h2>
        </div>

        <div className="risk-analysis-list">
          {recordsWithRisk.map((record) => (
            <article key={record.id} className="risk-analysis-card">
              <div className="record-header">
                <div>
                  <p className="eyebrow">{record.id}</p>
                  <h3>{record.location}</h3>
                </div>
                <span className={`risk-badge ${riskToneClass[record.riskLevel]}`}>
                  {record.riskLevel}
                </span>
              </div>

              <div className="detail-grid compact-grid">
                <DetailItem label="Registration Owner" value={record.registrationOwner} />
                <DetailItem label="Mutation Owner" value={record.mutationOwner} />
              </div>

              <div className="trigger-box">
                <strong>Triggered Risk Indicators</strong>
                {record.indicators.length > 0 ? (
                  <ul>
                    {record.indicators.map((indicator) => (
                      <li key={indicator}>{indicator}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No risk indicators triggered.</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )

  const viewMap = {
    dashboard: renderDashboard(),
    'land-search': renderLandSearch(),
    'fraud-detection': renderFraudDetection(),
    'risk-analysis': renderRiskAnalysis(),
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">O</div>
          <div>
            <h2>Obichol</h2>
            <p>Land Intelligence &amp; Fraud Detection</p>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-button ${activeView === item.id ? 'active' : ''}`}
              onClick={() => handleNavigation(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-note">
          <strong>Illustrative Sample Data</strong>
          <p>Not verified government land records.</p>
        </div>
      </aside>

      <main className="main-panel">{viewMap[activeView]}</main>
    </div>
  )
}

function SummaryCard({ label, value, tone }) {
  const toneClass =
    tone === 'high'
      ? 'summary-high'
      : tone === 'medium'
        ? 'summary-medium'
        : tone === 'low'
          ? 'summary-low'
          : 'summary-neutral'

  return (
    <article className={`summary-card ${toneClass}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}

function DetailItem({ label, value }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export default App
