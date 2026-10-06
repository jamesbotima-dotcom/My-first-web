const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const uploadForm = document.getElementById('uploadForm');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const galleryGrid = document.getElementById('galleryGrid');
const themeToggle = document.getElementById('themeToggle');
const rootElement = document.documentElement;

const savedTheme = localStorage.getItem('memories-theme');
if (savedTheme === 'dark' || savedTheme === 'light') {
  rootElement.dataset.theme = savedTheme;
}

function updateThemeButton() {
  if (!themeToggle) return;
  const isDark = rootElement.dataset.theme === 'dark';
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.setAttribute('aria-label', isDark ? 'Activer le mode clair' : 'Activer le mode sombre');
  const label = themeToggle.querySelector('.theme-label');
  if (label) label.textContent = isDark ? 'Mode clair' : 'Mode sombre';
}

updateThemeButton();
themeToggle?.addEventListener('click', () => {
  rootElement.dataset.theme = rootElement.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('memories-theme', rootElement.dataset.theme);
  updateThemeButton();
});

let isLoggedIn = false;

if (signupForm) {
  signupForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('signupMessage');

    if (!fullName || !phone) {
      message.textContent = 'Remplissez votre nom et votre numéro de téléphone.';
      return;
    }

    message.textContent = `Bienvenue ${fullName} ! Votre compte a bien été créé avec le numéro ${phone}${email ? ` et l’email ${email}` : ''}.`;
    signupForm.reset();
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const phone = document.getElementById('loginPhone').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const message = document.getElementById('loginMessage');

    if (!phone || !password) {
      message.textContent = 'Veuillez remplir votre numéro et votre mot de passe.';
      return;
    }

    isLoggedIn = true;
    message.textContent = `Connexion réussie. Bienvenue dans votre espace Memories, ${phone}.`;
    loginForm.reset();
  });
}

if (uploadForm) {
  uploadForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = document.getElementById('videoTitle').value.trim();
    const author = document.getElementById('videoAuthor').value.trim();
    const category = document.getElementById('videoCategory').value;
    const description = document.getElementById('videoDescription').value.trim();
    const fileInput = document.getElementById('videoFile');
    const imageFile = fileInput.files[0];
    const uploadMessage = document.getElementById('uploadMessage');

    if (!isLoggedIn) {
      uploadMessage.textContent = 'Vous devez être connecté pour publier une illustration.';
      return;
    }

    if (!title || !author || !imageFile) {
      uploadMessage.textContent = 'Veuillez remplir tous les champs et choisir une illustration ou un contenu visuel.';
      return;
    }

    const categories = {
      Mangas: { icon: 'icon-book', className: 'manga-card' },
      Gaming: { icon: 'icon-gamepad', className: 'gaming-card' },
      Amis: { icon: 'icon-users', className: 'activity-card' }
    };
    const selectedCategory = categories[category] || categories.Amis;

    const card = document.createElement('article');
    card.className = `video-card illustration-card ${selectedCategory.className}`;

    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    thumb.style.backgroundImage = `linear-gradient(135deg, rgba(42, 25, 83, .12), rgba(12, 8, 22, .16)), url("${URL.createObjectURL(imageFile)}")`;
    const iconBadge = document.createElement('span');
    iconBadge.className = 'icon-badge';
    iconBadge.innerHTML = `<svg class="category-icon" aria-hidden="true"><use href="#${selectedCategory.icon}"></use></svg>`;
    thumb.append(iconBadge);

    const body = document.createElement('div');
    body.className = 'video-card-body';
    const meta = document.createElement('div');
    meta.className = 'meta-row';
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = category === 'Amis' ? 'Amis' : category;
    const duration = document.createElement('span');
    duration.className = 'duration';
    duration.textContent = 'Illustration';
    meta.append(tag, duration);
    const heading = document.createElement('h3');
    heading.textContent = title;
    const authorLine = document.createElement('p');
    authorLine.textContent = `Par ${author}`;
    const note = document.createElement('p');
    note.className = 'mini-note';
    note.textContent = description || 'Nouvelle idée dans la communauté Memories.';
    body.append(meta, heading, authorLine, note);
    card.append(thumb, body);

    galleryGrid.prepend(card);
    uploadMessage.textContent = `L’illustration « ${title} » a bien été ajoutée à la communauté.`;
    uploadForm.reset();
  });
}

if (chatForm && chatMessages && chatInput) {
  chatForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!isLoggedIn) {
      const loginMessage = document.getElementById('loginMessage');
      if (loginMessage) {
        loginMessage.textContent = 'Connectez-vous pour envoyer un message ou publier.';
      }
      return;
    }

    const value = chatInput.value.trim();
    if (!value) return;

    const userMessage = document.createElement('div');
    userMessage.className = 'message outgoing';
    userMessage.innerHTML = `
      <strong>Moi</strong>
      <p>${value}</p>
    `;

    chatMessages.appendChild(userMessage);
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
      const reply = document.createElement('div');
      reply.className = 'message incoming';
      const replies = ['Ça semble cool !', 'J’aime l’idée.', 'On le poste ce soir ?', 'Très bonne vibe !'];
      const randomText = replies[Math.floor(Math.random() * replies.length)];
      reply.innerHTML = `
        <strong>Amis</strong>
        <p>${randomText}</p>
      `;
      chatMessages.appendChild(reply);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 500);
  });
}

