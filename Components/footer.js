class FooterComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  isActive(path) {
    return window.location.pathname.includes(path) ? "active" : "";
  }

  render() {
    this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
                width: 100%;
                padding: 3rem 2rem;
                background-color: #333333;
                color: white;
                box-sizing: border-box;
            }

            .footer-content {
                width: 100%;
                max-width: 80rem;
                margin: 0 auto;
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 2rem;
            }

            .footer-section h4 {
                color: white;
                font-size: 1rem;
                margin-bottom: 1rem;
                font-weight: 600;
            }

            .company-name {
                color: #8cc55a;
                font-size: 1.1rem;
                margin-bottom: 1rem;
                font-weight: 600;
            }

            .company-desc {
                color: #868686;
                line-height: 1.5;
                font-size: 0.875rem;
            }

            .footer-section ul {
                list-style: none;
                padding: 0;
                margin: 0;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .footer-section ul li {
                margin: 0;
            }

            .footer-section ul a {
                color: #868686;
                text-decoration: none;
                transition: color 0.3s ease;
                font-size: 0.875rem;
                display: inline-block;
            }

            .footer-section ul a:hover {
                color: #8cc55a;
            }

            .footer-section ul a.active {
                color: #8cc55a;
            }

            .contact-info li {
                display: flex;
                align-items: flex-start;
                gap: 0.5rem;
                color: #868686;
                margin-bottom: 0.75rem;
            }

            .icon {
                width: 1.125rem;
                height: 1.125rem;
                display: inline-block;
                color: #8cc55a;
                flex-shrink: 0;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
            }

            .phone-icon {
                background-image: url("/Assets/icons/phone.svg");
                filter: invert(76%) sepia(29%) saturate(1096%) hue-rotate(43deg)
                    brightness(93%) contrast(89%);
            }

            .email-icon {
                background-image: url("/Assets/icons/mail.svg");
                filter: invert(76%) sepia(29%) saturate(1096%) hue-rotate(43deg)
                    brightness(93%) contrast(89%);
            }

            .map-icon {
                background-image: url("/Assets/icons/map-pin.svg");
                filter: invert(76%) sepia(29%) saturate(1096%) hue-rotate(43deg)
                    brightness(93%) contrast(89%);
            }

            .social-heading {
                margin-top: 1.5rem;
            }

            .social-links {
                display: flex;
                gap: 1rem;
                margin-top: 1rem;
            }

            .social-icon {
                color: #868686;
                transition: color 0.3s ease;
                display: inline-block;
            }

            .social-icon:hover {
                color: #8cc55a;
            }

            .facebook-icon {
                background-image: url("/Assets/icons/facebook.svg");
                filter: invert(55%) sepia(11%) saturate(0%) hue-rotate(251deg) brightness(94%)
                    contrast(92%);
            }

            .instagram-icon {
                background-image: url("/Assets/icons/instagram.svg");
                filter: invert(55%) sepia(11%) saturate(0%) hue-rotate(251deg) brightness(94%)
                    contrast(92%);
            }

            .twitter-icon {
                background-image: url("/Assets/icons/twitter.svg");
                filter: invert(55%) sepia(11%) saturate(0%) hue-rotate(251deg) brightness(94%)
                    contrast(92%);
            }

            .social-icon:hover .icon {
                filter: invert(80%) sepia(11%) saturate(1740%) hue-rotate(47deg)
                    brightness(88%) contrast(89%);
            }

            .footer-bottom {
                width: 100%;
                margin-top: 2rem;
                padding-top: 2rem;
                border-top: 1px solid #868686;
                text-align: center;
                color: #868686;
                font-size: 0.875rem;
            }

            @media (max-width: 900px) {
                .footer-content {
                    grid-template-columns: repeat(2, 1fr);
                    gap: 2rem;
                }

                .footer-section {
                    margin-bottom: 2rem;
                }
            }

            @media (max-width: 600px) {
                .footer-content {
                    grid-template-columns: 1fr;
                }

                .modern-footer {
                    padding: 2rem 1rem;
                }

                .company-name {
                    font-size: 1.25rem;
                }

                .footer-section h4 {
                    font-size: 1.1rem;
                }

                .footer-section ul a,
                .company-desc,
                .contact-info li,
                .footer-bottom {
                    font-size: 0.875rem;
                }
            </style>
            <footer class="modern-footer">
                <div class="footer-content">
                    <div class="footer-section company-info">
                        <h2 class="company-name">Cema Construction</h2>
                        <p class="company-desc">Building your dreams with quality and trust.</p>
                    </div>
                    <div class="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="/Sections/Home/page.html" class="${this.isActive(
                              "/Home"
                            )}">Home</a></li>
                            <li><a href="#">Portfolio</a></li>
                            <li><a href="/Sections/My_Projects/page.html" class="${this.isActive(
                              "/My_Projects"
                            )}">My Project</a></li>
                            <li><a href="#">Services</a></li>
                            <li><a href="#">About Us</a></li>
                            <li><a href="/Sections/Contact_Us/page.html" class="${this.isActive(
                              "/Contact_Us"
                            )}">Contact Us</a></li>
                        </ul>
                    </div>
                
                    <div class="footer-section">
                        <h4>Kontak</h4>
                        <ul class="contact-info">
                            <li>
                                <i class="icon phone-icon"></i>
                                <span>+62 812-3456-7890</span>
                            </li>
                            <li>
                                <i class="icon email-icon"></i>
                                <span>info@companyx.com</span>
                            </li>
                            <li>
                                <i class="icon map-icon"></i>
                                <span>Jl. Contoh No. 123, Jakarta, Indonesia</span>
                            </li>
                        </ul>
                    </div>

                <div class="footer-section">
                    <h4>FAQ</h4>
                    <ul class="faq-links">
                        <li><a href="#">Cara Booking?</a></li>
                        <li><a href="#">Biaya Konsultasi?</a></li>
                        <li><a href="#">Durasi Proyek?</a></li>
                    </ul>

                        <h4 class="social-heading">Ikuti Kami</h4>
                        <div class="social-links">
                            <a href="#" class="social-icon">
                                <i class="icon facebook-icon"></i>
                            </a>
                            <a href="#" class="social-icon">
                                <i class="icon instagram-icon"></i>
                            </a>
                            <a href="#" class="social-icon">
                                <i class="icon twitter-icon"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="footer-bottom">
                    &copy; 2012 Cema Construction. All rights reserved.
                </div>
            </footer>
        `;
  }
}

// Register the custom element
customElements.define("footer-component", FooterComponent);
