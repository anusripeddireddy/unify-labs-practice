
class SettingsManager {
  constructor() {
    this.defaults = {
      theme: 'light',
      language: 'en',
      fontSize: 'medium'
    };
    this.translations = {
      en: {
        title: 'Persistent Settings Manager',
        subtitle: 'Your preferences are automatically saved and restored',
        sample: 'Sample Content Area',
        sampleText1: 'This text demonstrates how settings affect the entire app.',
        sampleText2: 'Settings are saved to your browser and restored automatically.',
        settings: 'Settings',
        theme: 'Theme',
        language: 'Language',
        fontSize: 'Font Size',
        statusSaved: 'Settings saved automatically',
        statusLoading: 'Loading saved preferences...'
      },
      es: {
        title: 'Administrador de Configuraciones Persistentes',
        subtitle: 'Tus preferencias se guardan y restauran automáticamente',
        sample: 'Área de Contenido de Ejemplo',
        sampleText1: 'Este texto demuestra cómo las configuraciones afectan toda la aplicación.',
        sampleText2: 'Las configuraciones se guardan en tu navegador y se restauran automáticamente.',
        settings: 'Configuraciones',
        theme: 'Tema',
        language: 'Idioma',
        fontSize: 'Tamaño de Fuente',
        statusSaved: 'Configuraciones guardadas automáticamente',
        statusLoading: 'Cargando preferencias guardadas...'
      },
      fr: {
        title: 'Gestionnaire de Paramètres Persistants',
        subtitle: 'Vos préférences sont automatiquement sauvegardées et restaurées',
        sample: 'Zone de Contenu Exemple',
        sampleText1: 'Ce texte montre comment les paramètres affectent toute l\'application.',
        sampleText2: 'Les paramètres sont sauvegardés dans votre navigateur et restaurés automatiquement.',
        settings: 'Paramètres',
        theme: 'Thème',
        language: 'Langue',
        fontSize: 'Taille de Police',
        statusSaved: 'Paramètres sauvegardés automatiquement',
        statusLoading: 'Chargement des préférences sauvegardées...'
      },
      hi: {
        title: 'स्थायी सेटिंग्स प्रबंधक',
        subtitle: 'आपकी प्राथमिकताएँ स्वचालित रूप से सहेजी और पुनर्स्थापित की जाती हैं',
        sample: 'नमूना सामग्री क्षेत्र',
        sampleText1: 'यह पाठ दिखाता है कि सेटिंग्स पूरे ऐप को कैसे प्रभावित करती हैं।',
        sampleText2: 'सेटिंग्स आपके ब्राउज़र में सहेजी जाती हैं और स्वचालित रूप से पुनर्स्थापित होती हैं।',
        settings: 'सेटिंग्स',
        theme: 'थीम',
        language: 'भाषा',
        fontSize: 'फ़ॉन्ट आकार',
        statusSaved: 'सेटिंग्स स्वचालित रूप से सहेजी गईं',
        statusLoading: 'सहेजी गई प्राथमिकताएँ लोड हो रही हैं...'
      }
    };
    
    this.init();
  }

  init() {
    this.loadSettings();
    this.applySettings();
    this.bindEvents();
  }

  loadSettings() {
    const saved = localStorage.getItem('appSettings');
    this.settings = saved ? { ...this.defaults, ...JSON.parse(saved) } : { ...this.defaults };
  }

  saveSettings() {
    localStorage.setItem('appSettings', JSON.stringify(this.settings));
  }

  updateSetting(key, value) {
    this.settings[key] = value;
    this.saveSettings();
    this.applySettings();
    this.showStatus('saved');
  }

  applySettings() {
    // Apply theme
    document.documentElement.setAttribute('data-theme', this.settings.theme);
    
    // Apply font size
    document.body.className = `font-${this.settings.fontSize}`;
    
    // Apply language
    this.updateLanguage();
  }

  updateLanguage() {
    const lang = this.translations[this.settings.language] || this.translations.en;
    
    document.querySelector('h1').textContent = lang.title;
    document.querySelector('.header p').textContent = lang.subtitle;
    document.querySelector('.demo-section h2').textContent = lang.sample;
    document.querySelector('.demo-section p:nth-child(3)').textContent = lang.sampleText1;
    document.querySelector('.demo-section p:nth-child(4)').textContent = lang.sampleText2;
    document.querySelector('.settings-panel h2').nextElementSibling.textContent = lang.settings;
    
    // Update labels
    const labels = document.querySelectorAll('.setting-group label');
    labels[0].textContent = lang.theme;
    labels[1].textContent = lang.language;
    labels[2].textContent = lang.fontSize;
  }

  bindEvents() {
    // Theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.updateSetting('theme', e.target.dataset.theme);
      });
    });

    // Font size buttons
    document.querySelectorAll('.font-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.font-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.updateSetting('fontSize', e.target.dataset.size);
      });
    });

    // Language select
    document.getElementById('languageSelect').addEventListener('change', (e) => {
      this.updateSetting('language', e.target.value);
    });

    // Update controls to reflect saved settings
    document.querySelector(`[data-theme="${this.settings.theme}"]`).classList.add('active');
    document.querySelector(`[data-size="${this.settings.fontSize}"]`).classList.add('active');
    document.getElementById('languageSelect').value = this.settings.language;
  }

  showStatus(type) {
    const statusBar = document.getElementById('statusBar');
    const messages = {
      saved: 'Settings saved automatically',
      loading: 'Loading saved preferences...'
    };
    statusBar.textContent = messages[type] || messages.saved;
  }
}

// Make globally available
window.SettingsManager = SettingsManager;
