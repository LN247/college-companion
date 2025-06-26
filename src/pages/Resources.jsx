<div className="resources-container">
  <div className="resource-card tech-card">
    <h2 className="resource-title">Tech & Engineering</h2>
    <ul className="resource-list">
      {techRoadmaps.map((item, i) => (
        <li key={i}><a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a></li>
      ))}
    </ul>
  </div>

  <div className="resource-card academic-card">
    <h2 className="resource-title">Academic Resources</h2>
    <ul className="resource-list">
      {academicLinks.map((item, i) => (
        <li key={i}><a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a></li>
      ))}
    </ul>
  </div>

  <div className="resource-card business-card">
    <h2 className="resource-title">Business & Accounting</h2>
    <ul className="resource-list">
      {businessResources.map((item, i) => (
        <li key={i}><a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a></li>
      ))}
    </ul>
  </div>

  <div className="resource-card expert-card">
    <h2 className="resource-title">Expert Advice</h2>
    <ul className="resource-list">
      {expertAdvice.map((item, i) => (
        <li key={i}><a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a></li>
      ))}
    </ul>
  </div>
</div>
