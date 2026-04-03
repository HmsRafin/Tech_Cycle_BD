import "./Home.css";
import bg from '../assets/bg.jpg';
function Home() {
  return (
    <div className="home">

      <section className="hero" style={{ backgroundImage: `url(${bg})` }}>
        <h1>Safe & Responsible E-Waste Disposal</h1>
        <p>Schedule secure pickup and protect the environment.</p>
        {/* <button className="hero-btn">Request Pickup</button> */}
      </section>

      <section className="features">
        <div className="card">
          <h3>Toxic Materials</h3>
          <p>Devices contain harmful chemicals like lead and mercury.</p>
        </div>
        <div className="card">
          <h3>Environmental Pollution</h3>
          <p>Improper disposal contaminates soil and water.</p>
        </div>
        <div className="card">
          <h3>Health Risks</h3>
          <p>Unsafe recycling causes severe health issues.</p>
        </div>
      </section>

    </div>
  );
}

export default Home;

