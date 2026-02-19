class DigitalPet {
  constructor(name = "Pixel") {
    this.name = name;
    this.#initializeStats();
    this.#saveState();
  }

  // Private fields
  #hunger = 50;
  #energy = 50;
  #happiness = 50;
  #isAlive = true;

  // Getters
  get hunger() { return Math.max(0, Math.min(100, this.#hunger)); }
  get energy() { return Math.max(0, Math.min(100, this.#energy)); }
  get happiness() { return Math.max(0, Math.min(100, this.#happiness)); }
  get isAlive() { return this.#isAlive; }
  get mood() {
    if (this.#hunger > 80 || this.#energy < 20) return "sad";
    if (this.#happiness > 80) return "happy";
    if (this.#energy < 40) return "tired";
    return "neutral";
  }

  // Private methods
  #clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, value));
  }

  #updateHealth() {
    if (this.#hunger > 95 || this.#energy < 5) {
      this.#isAlive = false;
    }
  }

  #saveState() {
    localStorage.setItem('digitalPet', JSON.stringify({
      name: this.name,
      hunger: this.#hunger,
      energy: this.#energy,
      happiness: this.#happiness
    }));
  }

  #loadState() {
    const saved = localStorage.getItem('digitalPet');
    if (saved) {
      const data = JSON.parse(saved);
      this.#hunger = data.hunger || 50;
      this.#energy = data.energy || 50;
      this.#happiness = data.happiness || 50;
    }
  }

  #initializeStats() {
    this.#loadState();
  }

  // Public methods - Player interactions
  eat() {
    if (!this.#isAlive) return "💀 Your pet has passed away...";

    const foodEffect = 25 + Math.random() * 15;
    this.#hunger = Math.max(0, this.#hunger - foodEffect);
    
    // Eating restores some energy but might affect happiness if overfed
    this.#energy = Math.min(100, this.#energy + 10);
    this.#happiness = this.#hunger < 20 ? 
      Math.min(100, this.#happiness + 5) : 
      Math.max(0, this.#happiness - 2);

    this.#updateHealth();
    this.#saveState();
    
    return `🍖 ${this.name} ate happily! Hunger: ${this.hunger}`;
  }

  play() {
    if (!this.#isAlive) return "💀 Your pet has passed away...";

    if (this.#energy < 15) {
      return `😴 ${this.name} is too tired to play!`;
    }

    const playEffect = 20 + Math.random() * 10;
    this.#happiness = Math.min(100, this.#happiness + playEffect);
    this.#energy = Math.max(0, this.#energy - 25);
    this.#hunger = Math.min(100, this.#hunger + 15);

    this.#updateHealth();
    this.#saveState();
    
    return `⚽ ${this.name} had fun playing! Happiness: ${this.happiness}`;
  }

  sleep() {
    if (!this.#isAlive) return "💀 Your pet has passed away...";

    const restEffect = 30 + Math.random() * 20;
    this.#energy = Math.min(100, this.#energy + restEffect);
    
    // Sleeping when hungry reduces happiness
    if (this.#hunger > 70) {
      this.#happiness = Math.max(0, this.#happiness - 10);
      return `😴 ${this.name} slept but woke up hungry...`;
    }

    this.#saveState();
    return `😴 ${this.name} slept well and feels refreshed!`;
  }

  // Auto-decay (simulates time passing)
  tick() {
    if (!this.#isAlive) return;

    this.#hunger = Math.min(100, this.#hunger + 1 + Math.random());
    this.#energy = Math.max(0, this.#energy - 0.5);
    this.#happiness = Math.max(0, this.#happiness - 0.3);

    this.#updateHealth();
    this.#saveState();
  }

  // Reset to new pet
  restart(name = "Pixel") {
    this.name = name;
    this.#hunger = 50;
    this.#energy = 50;
    this.#happiness = 50;
    this.#isAlive = true;
    this.#saveState();
    return `🐾 Welcome ${this.name}!`;
  }

  // Get current status for UI
  getStatus() {
    if (!this.#isAlive) return { message: "💀 RIP", class: "danger" };
    
    const needs = [];
    if (this.#hunger > 70) needs.push("hungry");
    if (this.#energy < 30) needs.push("tired");
    if (this.#happiness < 30) needs.push("sad");

    return {
      message: needs.length ? `${this.name} needs ${needs.join(' & ')}!` : `${this.name} is happy!`,
      class: needs.length ? "warning" : "success"
    };
  }
}
