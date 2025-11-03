class NavigationBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  isActive(path) {
    return window.location.pathname.includes(path) ? "active" : "";
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    left: 0;
                    top: 0;
                    width: calc(100% - 10dvw);
                    z-index: 1000;
                }

                nav {
                    height: min-content;
                    width: 100%;
                    padding: 1.11dvw 5dvw;
                    display: flex;
                    flex-direction: row;
                    justify-items: flex-start;
                    align-items: center;
                    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
                    backdrop-filter: blur(1.11rem);
                }

                nav img {
                    height: 4dvw;
                }

                nav ul {
                    justify-content: flex-end;
                    flex-grow: 1;
                    list-style-type: none;
                    display: flex;
                    flex-direction: row;
                    gap: 1.5rem;
                    margin: 0;
                    padding: 0;
                }

                nav ul li {
                    font-size: 1rem;
                    color: #000000;
                    cursor: pointer;
                }

                nav ul li:hover {
                    text-decoration: underline;
                    text-underline-offset: 0.3rem;
                }

                .active {
                    text-decoration: underline;
                    text-underline-offset: 0.3rem;
                }

                a, a:visited {
                    color: inherit;
                    text-decoration: inherit;
                }
            </style>
            <nav>
                <img src="/Assets/Cema_Logo.png" alt="Cema Logo">
                <ul>
                    <li class="${this.isActive("/Home")}">
                        <a href="/Sections/Home/page.html">Home</a>
                    </li>
                    <li class="${this.isActive("/My_Projects")}">
                        <a href="/Sections/My_Projects/page.html">My Project</a>
                    </li>
                    <li><a href="#">Services</a></li>
                    <li><a href="#">About Us</a></li>
                    <li class="${this.isActive("/Contact_Us")}">
                        <a href="/Sections/Contact_Us/page.html">Contact Us</a>
                    </li>
                    <li><a href="#">Account</a></li>
                </ul>
            </nav>
        `;
  }
}

// Register the custom element
customElements.define("navigation-bar", NavigationBar);
