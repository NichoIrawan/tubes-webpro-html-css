// Single FooterComponent definition
class FooterComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  isActive(path) {
    return window.location.pathname.includes(path) ? 'active' : '';
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; width:100%; box-sizing:border-box; background:#333; color:#fff; }
        .modern-footer{ padding:48px 24px; }
        .footer-content{ max-width:1280px; margin:0 auto; display:grid; grid-template-columns:repeat(4,1fr); gap:24px; }
        .company-name{ color:#8CC55A; font-weight:700; margin:0 0 8px; }
        .company-desc{ color:#bfbfbf; margin:0 0 12px; font-size:0.95rem }
        .footer-section h4{ color:#fff; margin:0 0 8px; font-size:1rem }
        .footer-section ul{ list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:8px }
        .footer-section a{ color:#bfbfbf; text-decoration:none; font-size:0.95rem }
        .footer-section a:hover, .footer-section a.active{ color:#8CC55A }
        .contact-info li{ color:#bfbfbf; display:flex; gap:8px; align-items:flex-start }
        .footer-bottom{ border-top:1px solid rgba(255,255,255,0.06); margin-top:24px; padding-top:18px; text-align:center; color:#bfbfbf; font-size:0.95rem }
        @media(max-width:900px){ .footer-content{ grid-template-columns:repeat(2,1fr) } }
        @media(max-width:600px){ .footer-content{ grid-template-columns:1fr } .modern-footer{ padding:24px 12px } }
      </style>
      <footer class="modern-footer">
        <div class="footer-content">
          <div class="footer-section company-info">
            <h2 class="company-name">Company X</h2>
            <p class="company-desc">Solusi terpercaya untuk arsitektur dan desain interior Anda.</p>
          </div>

          <div class="footer-section">
            <h4>Link Cepat</h4>
            <ul>
              <li><a href="/Sections/Home/page.html" class="${this.isActive('/Home')}">Home</a></li>
              <li><a href="/Sections/My_Projects/page.html" class="${this.isActive('/My_Projects')}">My Project</a></li>
              <li><a href="/Sections/Service_page/service.html">Services</a></li>
              <li><a href="/Sections/Contact_Us/page.html" class="${this.isActive('/Contact_Us')}">Contact Us</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4>Kontak</h4>
            <ul class="contact-info">
              <li>+62 812-3456-7890</li>
              <li>info@companyx.com</li>
              <li>Jl. Contoh No. 123, Jakarta, Indonesia</li>
            </ul>
          </div>

          <div class="footer-section">
            <h4>FAQ</h4>
            <ul>
              <li><a href="#">Cara Booking?</a></li>
              <li><a href="#">Biaya Konsultasi?</a></li>
              <li><a href="#">Durasi Proyek?</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">&copy; ${new Date().getFullYear()} Company X. All rights reserved.</div>
      </footer>
    `;
  }
}

customElements.define('footer-component', FooterComponent);
