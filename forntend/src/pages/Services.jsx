import "./StaticPages.css";

function Services() {
  return (
    <div className="static-page">
      <h1>Our Services</h1>
      <div className="service-grid">
        <div className="service-card">
          <h3>Residential Pickup</h3>
          <p>We pick up old laptops, phones, chargers, and small appliances directly from your doorstep.</p>
        </div>
        <div className="service-card">
          <h3>Corporate Disposal</h3>
          <p>Bulk e-waste management for offices, including data destruction and certified recycling reports.</p>
        </div>
        <div className="service-card">
          <h3>Educational Workshops</h3>
          <p>Raising awareness about the dangers of improper e-waste disposal through community engagement.</p>
        </div>
      </div>
    </div>
  );
}

export default Services;
