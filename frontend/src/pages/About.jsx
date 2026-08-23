import React from 'react';

const About = () => {
  return (
    <div className="fade-in">
      {/* Hero Banner */}
      <section
        style={{
          height: '40vh',
          minHeight: '280px',
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=1200&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          color: '#ffffff',
        }}
      >
        <div className="container text-center">
          <h1 className="display-4 fw-extrabold mb-2" style={{ fontWeight: 900 }}>Our Story</h1>
          <p className="lead text-white-50">Kneading happiness and baking dreams since 2026</p>
        </div>
      </section>

      {/* Story & Philosophy */}
      <section className="py-5 container text-start">
        <div className="row align-items-center gy-4">
          <div className="col-12 col-md-6">
            <h2 className="fw-bold mb-3">Freshly Baked, Made with Love</h2>
            <p className="text-muted" style={{ lineHeight: '1.8' }}>
              At Virtual Unavagam, we believe food is not just about eating; it is an experience of joy, love, and connection. What started as a small virtual kitchen concept has grown into a beloved neighborhood culinary startup.
            </p>
            <p className="text-muted" style={{ lineHeight: '1.8' }}>
              Our secret is simple: we never compromise on quality. We source local organic vegetables, use premium custom-blend cheeses, and rise our pizza dough slow for 24 hours to create the lightest, crispiest base you have ever tasted.
            </p>
          </div>
          <div className="col-12 col-md-6 text-center">
            <img
              src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80"
              alt="Artisanal kitchen"
              className="img-fluid rounded-4 shadow-lg"
              style={{ maxHeight: '350px', objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* Core Principles Cards */}
<section className="py-5" style={{ backgroundColor: 'var(--bg-color)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Our Quality Promise</h2>
            <p className="text-muted">The core pillars that set Virtual Unavagam apart</p>
          </div>

          <div className="row g-4">
            {[
              { title: 'Fresh Ingredients ', desc: 'Sourced daily from organic farmers. No artificial preservatives or frozen additives.' },
              { title: 'Fast Delivery ', desc: 'Direct thermal insulated transport ensuring your food reaches you piping hot.' },
              { title: 'Customized Crusts ', desc: 'Thin crust, cheese burst, or gluten-free — customize items your way.' },
            ].map((principle, idx) => (
              <div key={idx} className="col-12 col-md-4 text-start">
                <div className="card h-100 p-4 border-0 shadow-sm rounded-4" style={{ backgroundColor: 'var(--card-bg)' }}>
                  <h5 className="fw-bold mb-3">{principle.title}</h5>
                  <p className="text-muted mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                    {principle.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
