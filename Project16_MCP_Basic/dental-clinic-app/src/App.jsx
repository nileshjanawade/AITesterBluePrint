import React, { useState, useEffect } from 'react';
import { 
  Calendar, BookOpen, MessageSquare, Star, Image as ImageIcon, 
  CreditCard, ShieldCheck, User, LogOut, ChevronRight, Plus, 
  CheckCircle, Clock, Sparkles, Award, Shield, Search, 
  Upload, FileText, Activity, Users, Send, Bell, Heart, AlertCircle, MapPin
} from 'lucide-react';
import './App.css';

// --- MOCK DATA ---
const ARTICLES = [
  { id: 1, title: 'Modern Smile Restoration', category: 'Innovation', desc: 'Discover how 3D scanning and digital printing are revolutionizing porcelain veneers.', color: '#ccfbf1', author: 'Dr. Sarah Sharma' },
  { id: 2, title: 'Oral & Heart Health Link', category: 'Wellness', desc: 'New research explains why healthy gums are critical for your cardiovascular system.', color: '#fef3c7', author: 'Dr. Rajesh Iyer' },
  { id: 3, title: 'Pediatric Care: A Gentle Start', category: 'Family', desc: 'Building positive dental associations early for a lifetime of healthy smiles.', color: '#dbeafe', author: 'Dr. Anjali Gupta' },
  { id: 4, title: 'Teeth Whitening: Fact vs Fiction', category: 'Cosmetic', desc: 'The science behind professional whitening treatments and what to avoid at home.', color: '#f3e8ff', author: 'Dr. Michael Grant' },
  { id: 5, title: 'Managing Dental Anxiety', category: 'Comfort', desc: 'Techniques and technologies that make your visit stress-free and relaxing.', color: '#ffedd5', author: 'Dr. Priyanshu Singh' },
  { id: 6, title: 'Invisible Orthodontics', category: 'Braces', desc: 'Unlocking the secret to straight teeth without the metal wires.', color: '#e0f2fe', author: 'Dr. Vikram Malhotra' },
];

const PRICING_DATA = [
  { service: 'Full Oral Examination', price: '₹1,500', benefit: 'Digital X-Rays included' },
  { service: 'Professional Scaling', price: '₹2,500', benefit: 'Deep cleaning & polishing' },
  { service: 'Root Canal Treatment', price: '₹6,500', benefit: 'Advanced rotary technology' },
  { service: 'Porcelain Veneers', price: '₹15,000', benefit: 'Ultra-thin aesthetic finish' },
  { service: 'Dental Implants', price: '₹35,000', benefit: 'Biocompatible titanium' },
  { service: 'Emergency Relief', price: '₹800', benefit: 'Pain management consultation' },
];

function App() {
  // --- STATE ---
  const [authState, setAuthState] = useState('onboarding'); // onboarding, login, register
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'patient', 'staff'
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Custom Saved Data (Mock DB)
  const [patientData, setPatientData] = useState({
    name: 'Patient Guest',
    age: '28',
    email: 'guest@dental.com'
  });

  const [appointments, setAppointments] = useState([
    { id: 101, patient: 'Demo Patient', date: '2026-03-25', time: '09:00 AM', status: 'Confirmed', notes: 'Initial cleaning', actions: 'Use soft-bristled brush', staffReply: 'Looking forward to seeing you!', attachment: null, medical: { bp: 'No', diabetes: 'No', history: 'No' } }
  ]);
  
  // Booking Form State
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('09:00 AM');
  const [bookingFile, setBookingFile] = useState(null);
  const [medicalInfo, setMedicalInfo] = useState({
    bp: 'No',
    diabetes: 'No',
    history: 'No'
  });

  // Staff Management State
  const [selectedAppt, setSelectedAppt] = useState(null); 
  const [replyText, setReplyText] = useState('');
  const [actionText, setActionText] = useState('');

  // Notification State
  const [notifications, setNotifications] = useState([]);

  // --- HELPERS ---
  const triggerEmail = (type, data) => {
    const id = Date.now();
    const newNote = { id, type, ...data };
    setNotifications(prev => [newNote, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 8000);
  };

  // --- HANDLERS ---
  const simulateLoading = (callback, duration = 2000) => {
    setIsLoading(true);
    setTimeout(() => {
      if (callback) callback();
      setIsLoading(false);
    }, duration);
  };

  const handleTabChange = (tab) => {
    simulateLoading(() => setActiveTab(tab), 1000);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = {
      name: fd.get('name'),
      age: fd.get('age'),
      email: fd.get('email')
    };
    simulateLoading(() => {
      setPatientData(data);
      setIsLoggedIn(true);
      setUserRole('patient');
      setCurrentUser(data.name);
      setActiveTab('dashboard');
      
      // Trigger Welcome Email Simulation
      triggerEmail('welcome', { 
        email: data.email, 
        name: data.name,
        subject: 'Welcome to CrystalSmile India'
      });
    });
  };

  const handleLogin = (role) => {
    simulateLoading(() => {
      setIsLoggedIn(true);
      setUserRole(role);
      setCurrentUser(role === 'staff' ? 'Dr. Smith' : patientData.name);
      setActiveTab('dashboard');
    });
  };

  const handleLogout = () => {
    simulateLoading(() => {
      setIsLoggedIn(false);
      setUserRole(null);
      setAuthState('onboarding');
    }, 1500);
  };

  const submitBooking = (e) => {
    e.preventDefault();
    const newAppt = {
      id: Date.now(),
      patient: currentUser,
      date: bookingDate,
      time: bookingTime,
      status: 'Pending',
      notes: 'Consultation Request',
      actions: '',
      staffReply: '',
      attachment: bookingFile ? bookingFile.name : null,
      medical: { ...medicalInfo }
    };
    simulateLoading(() => {
      setAppointments([...appointments, newAppt]);
      setActiveTab('dashboard');
      setBookingDate('');
      setMedicalInfo({ bp: 'No', diabetes: 'No', history: 'No' });
    });
  };

  const updateApptStatus = (id, status) => {
    simulateLoading(() => {
      setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
    }, 1200);
  };

  const saveStaffFeedback = () => {
    simulateLoading(() => {
      setAppointments(appointments.map(a => a.id === selectedAppt.id ? { 
        ...a, 
        actions: actionText, 
        staffReply: replyText,
        status: 'Examined'
      } : a));
      
      // Trigger Examination Report Email Simulation
      triggerEmail('report', {
        email: patientData.email,
        name: selectedAppt.patient,
        subject: 'Your Clinical Examination Report'
      });

      setSelectedAppt(null);
      setReplyText('');
      setActionText('');
    }, 1800);
  };

  // --- SUB-COMPONENTS ---
  const NotificationContainer = () => (
    <div className="notification-container">
      {notifications.map(n => (
        <div key={n.id} className="email-toast">
           <div className="toast-icon">
              {n.type === 'welcome' ? <Heart size={20}/> : <FileText size={20}/>}
           </div>
           <div className="toast-content">
              <div className="flex justify-between">
                <h5>{n.type === 'welcome' ? '📨 Welcome Email Sent' : '📊 Report Dispatched'}</h5>
                <span className="staff-badge">Simulation</span>
              </div>
              <p>Sent to: <strong>{n.email}</strong></p>
              <p className="mt-4">
                {n.type === 'welcome' 
                  ? `Hi ${n.name}, your account is active! Use the link below to access your premium portal.`
                  : `Dr. Smith has finalized your clinical report for ${n.name}. View actions in portal.`}
              </p>
              <span className="toast-link">{n.type === 'welcome' ? 'Login to Patient Portal' : 'Download Digital Report'}</span>
           </div>
        </div>
      ))}
    </div>
  );

  const LoadingScreen = () => {
    const tips = [
      'Preparing your treatment plan...',
      'Loading clinical records...',
      'Connecting to Dr. Pallavi\'s portal...',
      'Polishing your experience... ✨',
      'Securing your health data...',
    ];
    const tip = tips[Math.floor(Date.now() / 1000) % tips.length];

    // SVG tooth path reused for background decoration
    const ToothSVG = ({ style }) => (
      <svg viewBox="0 0 80 100" className="bg-tooth" style={style} xmlns="http://www.w3.org/2000/svg">
        <path d="M40 8 C22 8 14 20 14 38 C14 50 18 62 24 74 C28 83 34 92 40 92 C46 92 52 83 56 74 C62 62 66 50 66 38 C66 20 58 8 40 8Z" fill="currentColor"/>
        <path d="M28 38 C28 35 32 33 34 36 C36 39 40 39 44 36 C46 33 52 35 52 38" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );

    return (
      <div className="ls-root">
        {/* ── Animated teeth background ── */}
        <div className="ls-teeth-bg">
          {/* Top row */}
          {[...Array(9)].map((_, i) => (
            <ToothSVG key={`t${i}`} style={{ '--i': i, top: `${-8 + (i % 3) * 6}%`, left: `${4 + i * 11}%`, '--delay': `${i * 0.18}s` }} />
          ))}
          {/* Bottom row */}
          {[...Array(9)].map((_, i) => (
            <ToothSVG key={`b${i}`} style={{ '--i': i, bottom: `${-8 + (i % 3) * 6}%`, left: `${4 + i * 11}%`, '--delay': `${i * 0.18 + 0.9}s`, transform: 'rotate(180deg)' }} />
          ))}
          {/* Side accents */}
          {[...Array(4)].map((_, i) => (
            <ToothSVG key={`l${i}`} style={{ '--i': i, top: `${20 + i * 20}%`, left: '-3%', '--delay': `${i * 0.25}s`, transform: 'rotate(-30deg) scale(0.7)' }} />
          ))}
          {[...Array(4)].map((_, i) => (
            <ToothSVG key={`r${i}`} style={{ '--i': i, top: `${20 + i * 20}%`, right: '-3%', '--delay': `${i * 0.25 + 0.4}s`, transform: 'rotate(30deg) scale(0.7)' }} />
          ))}
        </div>

        {/* ── Central loader ── */}
        <div className="ls-center">
          {/* Outer rings */}
          <div className="ls-ring ls-ring-1" />
          <div className="ls-ring ls-ring-2" />

          {/* Doctor badge */}
          <div className="ls-badge">
            <span className="ls-badge-icon">🦷</span>
          </div>

          {/* Doctor name tag */}
          <div className="ls-doctor-tag">
            <span className="ls-dr-name">Dr. Pallavi Navali</span>
            <span className="ls-dr-title">BDS · MDS Gold Medalist</span>
          </div>

          {/* Progress bar */}
          <div className="ls-bar-track">
            <div className="ls-bar-fill" />
          </div>

          {/* Tip text */}
          <p className="ls-tip">{tip}</p>

          {/* Pulsing dots */}
          <div className="ls-dots">
            <span className="ls-dot" style={{ '--d': '0s' }} />
            <span className="ls-dot" style={{ '--d': '0.2s' }} />
            <span className="ls-dot" style={{ '--d': '0.4s' }} />
          </div>
        </div>

        {/* Brand watermark */}
        <div className="ls-watermark">🦷 CrystalSmile Dental · Pune</div>
      </div>
    );
  };


  const AuthForm = () => (
    <div className={`auth-page ${authState === 'login' ? 'login-bg' : 'register-bg'}`}>
      <div className="glass-card auth-card-v2 anim-slide-up">
        <button className="back-link-v2" onClick={() => setAuthState('onboarding')}>&larr; Exit</button>
        <div className="auth-header-v2">
           <div className="auth-icon-circle"><Shield size={24} /></div>
           <h2 className="title-gradient">{authState === 'login' ? 'Secure Login' : 'Join the Clinic'}</h2>
           <p className="auth-sub-v2">{authState === 'login' ? 'Access your treatment records and history.' : 'Register to unlock premium dental care.'}</p>
        </div>
        
        <form onSubmit={handleRegister}>
          {authState === 'register' && (
            <div className="form-grid-2">
              <div className="form-group-v2">
                <label>Full Name</label>
                <input 
                  name="name" 
                  type="text" 
                  placeholder="John Doe" 
                  required 
                  maxLength={40} 
                  pattern="[A-Za-z\s]+" 
                  title="Only letters and spaces allowed"
                  onInput={(e) => { e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '').slice(0, 40); }}
                />
              </div>
              <div className="form-group-v2">
                <label>Age</label>
                <input 
                  name="age" 
                  type="text" 
                  inputMode="numeric"
                  placeholder="25" 
                  required 
                  pattern="\d{1,2}"
                  title="Only 2 digits allowed"
                  onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 2); }}
                />
              </div>
            </div>
          )}
          <div className="form-group-v2">
            <label>Email Address</label>
            <input name="email" type="email" placeholder="name@email.com" required />
          </div>
          <div className="form-group-v2">
            <label>Password</label>
            <input type="password" placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn-primary full-width mt-20 h-55">
            {authState === 'login' ? 'Sign In to Portal' : 'Register Patient Account'}
          </button>
        </form>
        
        <div className="auth-footer-v2">
          {authState === 'login' ? (
            <p>New to CrystalSmile? <span onClick={() => setAuthState('register')}>Create Account</span></p>
          ) : (
            <p>Already a registered patient? <span onClick={() => setAuthState('login')}>Sign In</span></p>
          )}
        </div>
      </div>
    </div>
  );

  if (isLoading) return <LoadingScreen />;

  if (!isLoggedIn) {
    if (authState === 'login' || authState === 'register') return <AuthForm />;
    return (
      <div className="lp-root">
        {/* ─── STICKY NAVBAR ─── */}
        <nav className="lp-navbar">
          <div className="lp-nav-inner">
            <div className="lp-brand">🦷 Crystal<span>Smile</span></div>
            <div className="lp-nav-links">
              <a href="#services">Services</a>
              <a href="#expert">Our Doctor</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div className="lp-nav-actions">
              <button onClick={() => setAuthState('login')} className="lp-btn-ghost">Sign In</button>
              <button onClick={() => setAuthState('register')} className="lp-btn-solid">Register Now</button>
            </div>
          </div>
        </nav>

        {/* ─── HERO SECTION ─── */}
        <section className="lp-hero">
          <div className="lp-hero-overlay" />
          <div className="lp-hero-body">
            <div className="lp-hero-left">
              <div className="lp-trust-chip"><ShieldCheck size={14} /> Rated #1 Dental Clinic · India 2026</div>
              <h1 className="lp-hero-h1">
                Precision Dentistry<br />
                <span className="lp-grad">Crafted for You.</span>
              </h1>
              <p className="lp-hero-p">
                Experience compassionate, gold-standard dental care led by Dr. Pallavi Navali — BDS 1st Rank &amp; MDS Gold Medalist. From prevention to perfection, every smile deserves the best.
              </p>
              <div className="lp-hero-btns">
                <button onClick={() => setAuthState('register')} className="lp-btn-solid lp-btn-lg">Book Appointment</button>
                <button onClick={() => setAuthState('login')} className="lp-btn-ghost lp-btn-lg">Patient Login</button>
              </div>
              <div className="lp-quick-info">
                <div className="lp-qi-item"><Bell size={18} color="#f43f5e" /><div><strong>24/7 Emergency</strong><span>Dental trauma helpline</span></div></div>
                <div className="lp-qi-divider" />
                <div className="lp-qi-item"><Clock size={18} color="#0d9488" /><div><strong>Mon – Sat</strong><span>9:00 AM – 8:00 PM</span></div></div>
                <div className="lp-qi-divider" />
                <div className="lp-qi-item"><MapPin size={18} color="#6366f1" /><div><strong>Pune, India</strong><span>Walk-ins Welcome</span></div></div>
              </div>
            </div>
            <div className="lp-hero-right">
              <div className="lp-stats-panel">
                <div className="lp-stat"><span className="lp-stat-num">5,000+</span><span className="lp-stat-lbl">Happy Patients</span></div>
                <div className="lp-stat-sep" />
                <div className="lp-stat"><span className="lp-stat-num">#1</span><span className="lp-stat-lbl">MDS Gold Medalist</span></div>
                <div className="lp-stat-sep" />
                <div className="lp-stat"><span className="lp-stat-num">1st</span><span className="lp-stat-lbl">BDS Overall Rank</span></div>
                <div className="lp-stat-sep" />
                <div className="lp-stat"><span className="lp-stat-num">15+</span><span className="lp-stat-lbl">Years Experience</span></div>
              </div>
            </div>
          </div>
          <div className="lp-scroll-hint">↓ Scroll to explore</div>
        </section>

        {/* ─── EXPERT SECTION ─── */}
        <section className="lp-expert" id="expert">
          <div className="lp-section-tag">Meet Your Doctor</div>
          <h2 className="lp-section-h2">Academic Excellence Meets<br /><span className="lp-grad">Clinical Mastery</span></h2>
          <div className="lp-expert-card">
            <div className="lp-expert-visual">
              <div className="lp-medal-ring">
                <Award size={96} color="#facc15" strokeWidth={1.5} />
              </div>
              <div className="lp-expert-name-plate">
                <h3>Dr. Pallavi Navali</h3>
                <p>BDS (1st Rank) · MDS Gold Medalist</p>
              </div>
            </div>
            <div className="lp-expert-info">
              <div className="lp-gold-chip"><Award size={14} /> Gold Medalist Clinician · Pune</div>
              <h3 className="lp-expert-h3">The Gold Standard in<br />Modern Dentistry</h3>
              <p className="lp-expert-p">
                Dr. Pallavi Navali stands at the pinnacle of Indian dental education — securing <strong>1st Rank Overall in BDS</strong> and earning a <strong>Gold Medal in MDS</strong> from prestigious institutions. She trained and practised under legendary consultants in Pune, where she built a devoted patient following known for her painless, precise approach.
              </p>
              <div className="lp-credentials-row">
                <div className="lp-cred"><MapPin size={20} color="#0d9488" /><div><strong>Pune Clinical Heritage</strong><span>Mentored by Pune's finest consultants</span></div></div>
                <div className="lp-cred"><Users size={20} color="#6366f1" /><div><strong>Trusted by Thousands</strong><span>Recurring patients who swear by her care</span></div></div>
                <div className="lp-cred"><Star size={20} color="#f59e0b" /><div><strong>Gold Star Practitioner</strong><span>Top-ranked across BDS &amp; MDS programmes</span></div></div>
              </div>
              <button onClick={() => setAuthState('register')} className="lp-btn-solid lp-btn-lg lp-mt">Book a Consultation →</button>
            </div>
          </div>
        </section>

        {/* ─── SERVICES SECTION ─── */}
        <section className="lp-services" id="services">
          <div className="lp-section-tag">What We Offer</div>
          <h2 className="lp-section-h2">Comprehensive Dental Care<br /><span className="lp-grad">Under One Roof</span></h2>
          <div className="lp-services-grid">
            {[
              { icon: <Heart size={36} color="#0d9488" />, title: 'Preventative Care', desc: 'Regular check-ups, scaling & polishing to catch problems before they start.', color: '#ccfbf1' },
              { icon: <Sparkles size={36} color="#6366f1" />, title: 'Aesthetic Dentistry', desc: 'Veneers, whitening & bonding for the confident, radiant smile you deserve.', color: '#ede9fe' },
              { icon: <Shield size={36} color="#f59e0b" />, title: 'Emergency Relief', desc: 'Immediate care for root canals, trauma, toothache & acute pain — 24/7.', color: '#fef3c7' },
              { icon: <Activity size={36} color="#f43f5e" />, title: 'Surgical Procedures', desc: 'Implants, extractions & advanced surgical treatments in a sterile environment.', color: '#ffe4e6' },
              { icon: <Star size={36} color="#0ea5e9" />, title: 'Orthodontics', desc: 'Invisible aligners, braces & retainers tailored to your unique bite profile.', color: '#e0f2fe' },
              { icon: <BookOpen size={36} color="#10b981" />, title: 'Pediatric Dentistry', desc: 'Gentle, child-friendly dental care that builds lifelong healthy habits.', color: '#d1fae5' },
            ].map((s, i) => (
              <div key={i} className="lp-service-card" style={{ '--card-bg': s.color }}>
                <div className="lp-svc-icon">{s.icon}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── PRICING PREVIEW ─── */}
        <section className="lp-pricing" id="pricing">
          <div className="lp-section-tag">Transparent Pricing</div>
          <h2 className="lp-section-h2">No Hidden Costs.<br /><span className="lp-grad">Just Great Care.</span></h2>
          <div className="lp-pricing-grid">
            {PRICING_DATA.map((p, i) => (
              <div key={i} className="lp-price-card">
                <span className="lp-price-service">{p.service}</span>
                <span className="lp-price-tag">{p.price}</span>
                <span className="lp-price-note">{p.benefit}</span>
              </div>
            ))}
          </div>
          <p className="lp-pricing-note">* Prices are indicative and may vary based on clinical assessment. Register to get personalised quotes.</p>
        </section>

        {/* ─── CTA SECTION ─── */}
        <section className="lp-cta">
          <div className="lp-cta-inner">
            <h2>Your Healthiest Smile<br /><span className="lp-grad">Starts Today.</span></h2>
            <p>Join 5,000+ patients who trust Dr. Pallavi Navali for world-class dental care in Pune.</p>
            <div className="lp-cta-btns">
              <button onClick={() => setAuthState('register')} className="lp-btn-solid lp-btn-lg">Create Patient Account</button>
              <button onClick={() => handleLogin('staff')} className="lp-btn-ghost lp-btn-lg">Staff Portal →</button>
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="lp-footer">
          <div className="lp-footer-inner">
            <div className="lp-brand lp-brand-lg">🦷 CrystalSmile Dental</div>
            <p>© 2026 Dr. Pallavi Navali Dental Clinic · Pune, India · All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <nav className="navbar-fixed glass-card">
        <div className="nav-container">
          <div className="nav-brand" onClick={() => handleTabChange('dashboard')}>
            <span className="logo-glow">🦷</span>
            <span className="brand-name">Crystal<span className="title-gradient">Smile</span></span>
          </div>
          <div className="nav-items-center">
             <div className="search-bar-mock"><Search size={16} /><span>Search medical resources...</span></div>
          </div>
          <div className="nav-user-area">
             <div className="user-profile-pill"><User size={16} /><span>{currentUser || 'Patient'} {userRole === 'patient' && `(${patientData.age}y)`}</span></div>
             <button onClick={handleLogout} className="logout-btn"><LogOut size={18} /></button>
          </div>
        </div>
      </nav>

      <aside className="fixed-sidebar glass-card">
        <div className="sidebar-group">
          <p className="sidebar-label">Management</p>
          <button className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => handleTabChange('dashboard')}>
            {userRole === 'staff' ? <Activity size={20}/> : <Calendar size={20} />} 
            <span>{userRole === 'staff' ? 'Admin Dashboard' : 'My Records'}</span>
          </button>
          {userRole === 'patient' && (
            <button className={`nav-link ${activeTab === 'booking' ? 'active' : ''}`} onClick={() => handleTabChange('booking')}>
              <Plus size={20} /> <span>New Visit</span>
            </button>
          )}
        </div>
        <div className="sidebar-group">
          <p className="sidebar-label">Resources</p>
          <button className={`nav-link ${activeTab === 'education' ? 'active' : ''}`} onClick={() => handleTabChange('education')}>
            <BookOpen size={20} /> <span>Clinical Hub</span>
          </button>
        </div>
        <div className="sidebar-group">
          <p className="sidebar-label">Billing</p>
          <button className={`nav-link ${activeTab === 'pricing' ? 'active' : ''}`} onClick={() => handleTabChange('pricing')}>
            <CreditCard size={20} /> <span>Pricing Library</span>
          </button>
        </div>
      </aside>

      <div className="main-content-area">
        <main className="viewport-scroll">
          {/* --- DASHBOARD VIEW --- */}
          {activeTab === 'dashboard' && (
            <div className="view-fade-in">
              <div className="hero-header-small">
                 <h1>{userRole === 'staff' ? 'Staff Control Center' : `Welcome, ${currentUser}`}</h1>
                 <p>{userRole === 'staff' ? 'Monitor clinic flow and patient examinations.' : 'Access your dental history and treatment plans.'}</p>
              </div>

              <div className="dashboard-metrics">
                <div className="metric-card glass-card">
                   <div className="metric-icon bg-teal-soft"><Clock size={24} color="#0d9488" /></div>
                   <div className="metric-info"><span className="m-label">Scheduled Visits</span><span className="m-value">{appointments.length}</span></div>
                </div>
                <div className="metric-card glass-card">
                   <div className="metric-icon bg-amber-soft"><AlertCircle size={24} color="#f59e0b" /></div>
                   <div className="metric-info"><span className="m-label">Priority Alerts</span><span className="m-value">2</span></div>
                </div>
                <div className="metric-card glass-card">
                   <div className="metric-icon bg-blue-soft"><ShieldCheck size={24} color="#2563eb" /></div>
                   <div className="metric-info"><span className="m-label">Safety Rating</span><span className="m-value">A+</span></div>
                </div>
              </div>

              <div className="glass-card main-table-card">
                <div className="card-header">
                   <h3>Recent Activity</h3>
                </div>
                <div className="appt-list-modern">
                  {appointments.map(a => (
                    <div key={a.id} className="appt-row-new">
                       <div className="a-meta">
                          <span className="a-date">{a.date}</span>
                          <span className="a-time">{a.time}</span>
                       </div>
                       <div className="a-main">
                          <div className="patient-header">
                             <h4>{userRole === 'staff' ? a.patient : a.notes}</h4>
                             <span className={`status-pill sp-${a.status.toLowerCase()}`}>{a.status}</span>
                          </div>
                          {a.medical && (
                            <div className="medical-tags">
                               {a.medical.bp === 'Yes' && <span className="m-tag m-red">High BP</span>}
                               {a.medical.diabetes === 'Yes' && <span className="m-tag m-orange">Diabetic</span>}
                               {a.medical.history === 'Yes' && <span className="m-tag m-blue">Recent Root Canal</span>}
                            </div>
                          )}
                          {a.staffReply && <div className="reply-box"><strong>Clinical Note:</strong> {a.staffReply}</div>}
                          {a.actions && <div className="actions-box"><strong>Post-Care Actions:</strong> {a.actions}</div>}
                       </div>
                       {userRole === 'staff' && (
                         <div className="a-controls">
                            <div className="btn-group-staff">
                               {a.status === 'Pending' && (
                                 <button onClick={() => updateApptStatus(a.id, 'Confirmed')} className="btn-staff-action btn-staff-primary">
                                   <CheckCircle size={16}/> Accept
                                 </button>
                               )}
                               {a.status === 'Confirmed' && (
                                 <button onClick={() => setSelectedAppt(a)} className="btn-staff-action">
                                   <Activity size={16}/> Examine
                                 </button>
                               )}
                               {a.status === 'Examined' && (
                                 <button className="btn-staff-action" disabled>
                                   <Search size={16}/> Report Sent
                                 </button>
                               )}
                            </div>
                         </div>
                       )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* --- BOOKING VIEW --- */}
          {activeTab === 'booking' && (
            <div className="view-fade-in max-w-800">
              <div className="hero-header-small">
                 <h1>Consultation <span className="title-gradient">Screener</span></h1>
                 <p>Help us prepare for your visit by completing this medical profile.</p>
              </div>
              <div className="glass-card p-40 booking-container">
                 <form onSubmit={submitBooking} className="booking-form-advanced">
                    <div className="form-row">
                      <div className="form-group-v2">
                        <label>Preferred Date</label>
                        <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required min={new Date().toISOString().split('T')[0]} />
                      </div>
                      <div className="form-group-v2">
                        <label>Preferred Time</label>
                        <select value={bookingTime} onChange={(e) => setBookingTime(e.target.value)}>
                           <option>09:00 AM</option>
                           <option>10:30 AM</option>
                           <option>01:00 PM</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="medical-screening-section">
                       <h4><Activity size={18}/> Mandatory Medical Screening</h4>
                       <div className="screening-grid">
                          <div className="screen-item">
                             <span>Any history of High Blood Pressure?</span>
                             <div className="radio-group">
                                <label><input type="radio" name="bp" checked={medicalInfo.bp === 'Yes'} onChange={() => setMedicalInfo({...medicalInfo, bp: 'Yes'})}/> Yes</label>
                                <label><input type="radio" name="bp" checked={medicalInfo.bp === 'No'} onChange={() => setMedicalInfo({...medicalInfo, bp: 'No'})} /> No</label>
                             </div>
                          </div>
                          <div className="screen-item">
                             <span>Are you currently Diabetic?</span>
                             <div className="radio-group">
                                <label><input type="radio" name="dia" checked={medicalInfo.diabetes === 'Yes'} onChange={() => setMedicalInfo({...medicalInfo, diabetes: 'Yes'})}/> Yes</label>
                                <label><input type="radio" name="dia" checked={medicalInfo.diabetes === 'No'} onChange={() => setMedicalInfo({...medicalInfo, diabetes: 'No'})} /> No</label>
                             </div>
                          </div>
                          <div className="screen-item">
                             <span>Recent dental surgery (6 months)?</span>
                             <div className="radio-group">
                                <label><input type="radio" name="hist" checked={medicalInfo.history === 'Yes'} onChange={() => setMedicalInfo({...medicalInfo, history: 'Yes'})}/> Yes</label>
                                <label><input type="radio" name="hist" checked={medicalInfo.history === 'No'} onChange={() => setMedicalInfo({...medicalInfo, history: 'No'})} /> No</label>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="form-group-v2 mt-20">
                      <label>Medical Attachments (Optional)</label>
                      <div className="file-upload-zone">
                         <Upload size={24} />
                         <p>{bookingFile ? bookingFile.name : 'Click to upload past clinical reports'}</p>
                         <input type="file" onChange={(e) => setBookingFile(e.target.files[0])} />
                      </div>
                    </div>

                    <button type="submit" className="btn-accent h-60 full-width mt-32">Submit for Review</button>
                 </form>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="view-fade-in content-gap">
               <div className="hero-header-small">
                 <h1>Transparent <span className="title-gradient">Pricing</span></h1>
                 <p>Market-leading rates for premium dental excellence in India (2026).</p>
               </div>
               <div className="glass-card overflow-hidden">
                 <table className="premium-table">
                   <thead>
                     <tr>
                       <th>Specialized Service</th>
                       <th>Starting Price</th>
                       <th>Patient Benefits</th>
                     </tr>
                   </thead>
                   <tbody>
                     {PRICING_DATA.map((item, idx) => (
                       <tr key={idx} className="anim-fade-in" style={{animationDelay: `${idx * 0.1}s`}}>
                         <td><strong>{item.service}</strong></td>
                         <td className="text-primary font-800">{item.price}</td>
                         <td className="text-muted">{item.benefit}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
                 <div className="p-40 bg-faint text-center">
                    <p className="text-muted font-600">All prices are inclusive of GST and clinical taxes. EMI options available for major treatments.</p>
                 </div>
               </div>
            </div>
          )}
          {activeTab === 'education' && (
            <div className="view-fade-in content-gap">
               <div className="hero-header-small">
                 <h1>Clinical <span className="title-gradient">Resources</span></h1>
                 <p>Stay informed about your dental health journey.</p>
              </div>
              <div className="premium-grid-3">
                {ARTICLES.map(art => (
                  <div key={art.id} className="glass-card p-article-card">
                    <div className="p-article-hero" style={{background: art.color}}>
                       <BookOpen size={40} color="white" /><span className="art-cat">{art.category}</span>
                    </div>
                    <div className="p-article-body">
                       <h4>{art.title}</h4>
                       <p>{art.desc}</p>
                       <div className="p-article-footer"><span className="author">By {art.author}</span><button className="read-more">Learn More</button></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Overlay for Staff */}
          {selectedAppt && (
            <div className="modal-overlay">
              <div className="glass-card modal-content-v2 nm-anim">
                 <div className="modal-header-v2">
                    <h3 className="title-gradient">Clinical Feedback</h3>
                    <p>Examination record for {selectedAppt.patient}</p>
                    <button onClick={() => setSelectedAppt(null)} className="btn-close-v2">×</button>
                 </div>
                 <div className="modal-body-v2">
                    <div className="form-group-v2">
                      <label>Post-Examination Necessary Actions</label>
                      <textarea value={actionText} onChange={(e) => setActionText(e.target.value)} placeholder="e.g. Prescribed antibiotic course for 5 days..." />
                    </div>
                    <div className="form-group-v2 mt-20">
                      <label>Staff Personal Message</label>
                      <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="e.g. Looking forward to your next visit!" />
                    </div>
                 </div>
                 <div className="modal-footer-v2">
                    <button onClick={saveStaffFeedback} className="btn-primary full-width h-55"><Send size={18}/> Finalize Examination</button>
                 </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <NotificationContainer />
    </div>
  );
}

export default App;
