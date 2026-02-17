// THE VIRTUAL CORE – Terminal OS Simulation

// ----- State -----
const coreState = {
  users: {
    admin: {
      password: "admin",
      bank: { balance: 10000 },
      vault: {
        pin: "0000",
        locked: true,
        secret: "Welcome to THE VIRTUAL CORE. Change your PIN.",
      },
      inventory: [],
    },
  },
  session: {
    currentUser: null,
  },
};

// Simple ID generator for logs / transactions
let txCounter = 1;

// ----- DOM references -----
const bootScreen = document.getElementById("boot-screen");
const terminal = document.getElementById("terminal");
const output = document.getElementById("terminal-output");
const input = document.getElementById("terminal-input");
const promptLabel = document.getElementById("prompt-label");
const sessionUserEl = document.getElementById("session-user");
const sessionTimeEl = document.getElementById("session-time");

// ----- Boot sequence -----
setTimeout(() => {
  bootScreen.classList.add("hidden");
  terminal.classList.remove("hidden");
  corePrintBanner();
  printLine(
    'Type "help" to list commands. First time? Try: login admin admin',
    "output-system"
  );
  input.focus();
}, 1800);

// Time indicator
setInterval(() => {
  const now = new Date();
  sessionTimeEl.textContent = now.toLocaleTimeString();
}, 1000);

// ----- Terminal helpers -----
function printLine(text = "", cssClass = "") {
  const line = document.createElement("div");
  line.className = "output-line " + cssClass;
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function corePrintBanner() {
  printLine("=== THE VIRTUAL CORE ===", "output-system");
  printLine("Mini Terminal OS Simulation");
  printLine("-------------------------------------", "output-muted");
}

function setPrompt() {
  const user = coreState.session.currentUser || "guest";
  promptLabel.textContent = `${user}@core>`;
  sessionUserEl.textContent = user;
}

// ----- Command parsing -----
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const raw = input.value.trim();
    if (raw === "") return;
    handleCommand(raw);
    input.value = "";
  } else if (e.key === "ArrowUp") {
    // optional: command history
  }
});

function handleCommand(raw) {
  printLine(`${promptLabel.textContent} ${raw}`);
  const [cmd, ...rest] = raw.split(" ");
  const args = rest.filter((a) => a.length > 0);
  dispatchCommand(cmd.toLowerCase(), args);
}

function requireUser() {
  if (!coreState.session.currentUser) {
    printLine("Error: You must be logged in to do that.", "output-error");
    return false;
  }
  return true;
}

// ----- Command dispatcher -----
function dispatchCommand(cmd, args) {
  switch (cmd) {
    case "help":
      cmdHelp();
      break;

    // session / user
    case "login":
      cmdLogin(args);
      break;
    case "logout":
      cmdLogout();
      break;
    case "whoami":
      cmdWhoAmI();
      break;
    case "createuser":
      cmdCreateUser(args);
      break;

    // banking
    case "bank.balance":
      cmdBankBalance();
      break;
    case "bank.deposit":
      cmdBankDeposit(args);
      break;
    case "bank.withdraw":
      cmdBankWithdraw(args);
      break;
    case "bank.transfer":
      cmdBankTransfer(args);
      break;

    // vault
    case "vault.setpin":
      cmdVaultSetPin(args);
      break;
    case "vault.lock":
      cmdVaultLock();
      break;
    case "vault.unlock":
      cmdVaultUnlock(args);
      break;
    case "vault.write":
      cmdVaultWrite(args);
      break;
    case "vault.read":
      cmdVaultRead();
      break;

    // inventory
    case "inv.add":
      cmdInvAdd(args);
      break;
    case "inv.remove":
      cmdInvRemove(args);
      break;
    case "inv.list":
      cmdInvList();
      break;
    case "inv.search":
      cmdInvSearch(args);
      break;

    // misc
    case "clear":
      output.innerHTML = "";
      break;
    case "banner":
      corePrintBanner();
      break;
    case "exit":
      printLine("Session terminated. (Refresh page to reboot)", "output-warn");
      input.disabled = true;
      break;
    default:
      printLine(`Unknown command: ${cmd}`, "output-error");
      printLine('Type "help" for a list of commands.', "output-muted");
  }
}

// ----- HELP -----
function cmdHelp() {
  printLine("Core commands:", "output-system");
  printLine(" help                Show this help");
  printLine(" clear               Clear screen");
  printLine(" banner              Print boot banner");
  printLine(" exit                Lock input (simulate shutdown)");
  printLine("");
  printLine("User / Session:", "output-system");
  printLine(" login <user> <pass>");
  printLine(" logout");
  printLine(" whoami");
  printLine(" createuser <user> <pass>");
  printLine("");
  printLine("Banking:", "output-system");
  printLine(" bank.balance");
  printLine(" bank.deposit <amount>");
  printLine(" bank.withdraw <amount>");
  printLine(" bank.transfer <user> <amount>");
  printLine("");
  printLine("Vault:", "output-system");
  printLine(" vault.setpin <pin>");
  printLine(" vault.lock");
  printLine(" vault.unlock <pin>");
  printLine(" vault.write <text>");
  printLine(" vault.read");
  printLine("");
  printLine("Inventory:", "output-system");
  printLine(" inv.add <name> [qty]");
  printLine(" inv.remove <name> [qty]");
  printLine(" inv.list");
  printLine(" inv.search <term>");
}

// ----- USER / SESSION COMMANDS -----
function cmdLogin(args) {
  if (args.length < 2) {
    printLine("Usage: login <username> <password>", "output-warn");
    return;
  }
  const [username, password] = args;
  const user = coreState.users[username];
  if (!user || user.password !== password) {
    printLine("Auth failed: invalid credentials.", "output-error");
    return;
  }
  coreState.session.currentUser = username;
  setPrompt();
  printLine(`Logged in as ${username}.`, "output-system");
}

function cmdLogout() {
  if (!coreState.session.currentUser) {
    printLine("Not logged in.", "output-warn");
    return;
  }
  const user = coreState.session.currentUser;
  coreState.session.currentUser = null;
  setPrompt();
  printLine(`User ${user} logged out.`, "output-system");
}

function cmdWhoAmI() {
  const user = coreState.session.currentUser || "guest";
  printLine(user);
}

function cmdCreateUser(args) {
  if (args.length < 2) {
    printLine("Usage: createuser <username> <password>", "output-warn");
    return;
  }
  const [username, password] = args;
  if (coreState.users[username]) {
    printLine("Error: user already exists.", "output-error");
    return;
  }
  coreState.users[username] = {
    password,
    bank: { balance: 0 },
    vault: {
      pin: null,
      locked: true,
      secret: "",
    },
    inventory: [],
  };
  printLine(`User ${username} created.`, "output-system");
}

// ----- BANKING COMMANDS -----
function getCurrentBank() {
  const u = coreState.session.currentUser;
  if (!u) return null;
  return coreState.users[u].bank;
}

function cmdBankBalance() {
  if (!requireUser()) return;
  const bank = getCurrentBank();
  printLine(
    `[BANK] Balance for ${coreState.session.currentUser}: ₹${bank.balance.toFixed(
      2
    )}`
  );
}

function cmdBankDeposit(args) {
  if (!requireUser()) return;
  const amt = parseFloat(args[0]);
  if (isNaN(amt) || amt <= 0) {
    printLine("Usage: bank.deposit <positive amount>", "output-warn");
    return;
  }
  const bank = getCurrentBank();
  bank.balance += amt;
  const txId = txCounter++;
  printLine(
    `[BANK] +₹${amt.toFixed(
      2
    )} deposited | New balance: ₹${bank.balance.toFixed(2)} | TX#${txId}`,
    "output-system"
  );
}

function cmdBankWithdraw(args) {
  if (!requireUser()) return;
  const amt = parseFloat(args[0]);
  if (isNaN(amt) || amt <= 0) {
    printLine("Usage: bank.withdraw <positive amount>", "output-warn");
    return;
  }
  const bank = getCurrentBank();
  if (bank.balance < amt) {
    printLine("Insufficient funds.", "output-error");
    return;
  }
  bank.balance -= amt;
  const txId = txCounter++;
  printLine(
    `[BANK] -₹${amt.toFixed(
      2
    )} withdrawn | New balance: ₹${bank.balance.toFixed(2)} | TX#${txId}`,
    "output-system"
  );
}

function cmdBankTransfer(args) {
  if (!requireUser()) return;
  if (args.length < 2) {
    printLine("Usage: bank.transfer <targetUser> <amount>", "output-warn");
    return;
  }
  const [targetUser, amountStr] = args;
  const amt = parseFloat(amountStr);
  if (isNaN(amt) || amt <= 0) {
    printLine("Amount must be a positive number.", "output-error");
    return;
  }
  const fromUser = coreState.session.currentUser;
  if (!coreState.users[targetUser]) {
    printLine("Target user does not exist.", "output-error");
    return;
  }
  const fromBank = coreState.users[fromUser].bank;
  const toBank = coreState.users[targetUser].bank;

  if (fromBank.balance < amt) {
    printLine("Insufficient funds for transfer.", "output-error");
    return;
  }
  fromBank.balance -= amt;
  toBank.balance += amt;
  const txId = txCounter++;
  printLine(
    `[BANK] Transfer TX#${txId}: ₹${amt.toFixed(
      2
    )} from ${fromUser} → ${targetUser}`,
    "output-system"
  );
}

// ----- VAULT COMMANDS -----
function getCurrentVault() {
  const u = coreState.session.currentUser;
  if (!u) return null;
  return coreState.users[u].vault;
}

function cmdVaultSetPin(args) {
  if (!requireUser()) return;
  if (args.length < 1) {
    printLine("Usage: vault.setpin <4-digit-pin>", "output-warn");
    return;
  }
  const pin = args[0];
  if (!/^\d{4}$/.test(pin)) {
    printLine("PIN must be exactly 4 digits.", "output-error");
    return;
  }
  const vault = getCurrentVault();
  vault.pin = pin;
  vault.locked = true;
  printLine("Vault PIN set. Vault locked.", "output-system");
}

function cmdVaultLock() {
  if (!requireUser()) return;
  const vault = getCurrentVault();
  vault.locked = true;
  printLine("Vault locked.", "output-system");
}

function cmdVaultUnlock(args) {
  if (!requireUser()) return;
  const vault = getCurrentVault();
  if (!vault.pin) {
    printLine("Vault PIN not set. Use vault.setpin first.", "output-warn");
    return;
  }
  if (args.length < 1) {
    printLine("Usage: vault.unlock <pin>", "output-warn");
    return;
  }
  const pin = args[0];
  if (pin !== vault.pin) {
    printLine("Invalid PIN.", "output-error");
    return;
  }
  vault.locked = false;
  printLine("Vault unlocked.", "output-system");
}

function cmdVaultWrite(args) {
  if (!requireUser()) return;
  const vault = getCurrentVault();
  if (vault.locked) {
    printLine("Vault is locked. Unlock before writing.", "output-error");
    return;
  }
  if (args.length === 0) {
    printLine("Usage: vault.write <text>", "output-warn");
    return;
  }
  const text = args.join(" ");
  vault.secret = text;
  printLine("Vault content updated.", "output-system");
}

function cmdVaultRead() {
  if (!requireUser()) return;
  const vault = getCurrentVault();
  if (vault.locked) {
    printLine("Vault is locked. Unlock before reading.", "output-error");
    return;
  }
  if (!vault.secret) {
    printLine("[VAULT] Empty.", "output-muted");
    return;
  }
  printLine("[VAULT] " + vault.secret);
}

// ----- INVENTORY COMMANDS -----
function getCurrentInventory() {
  const u = coreState.session.currentUser;
  if (!u) return null;
  return coreState.users[u].inventory;
}

function cmdInvAdd(args) {
  if (!requireUser()) return;
  if (args.length < 1) {
    printLine("Usage: inv.add <name> [quantity]", "output-warn");
    return;
  }
  const name = args[0];
  const qty = args[1] ? parseInt(args[1], 10) : 1;
  if (isNaN(qty) || qty <= 0) {
    printLine("Quantity must be a positive integer.", "output-error");
    return;
  }
  const inventory = getCurrentInventory();
  const existing = inventory.find(
    (item) => item.name.toLowerCase() === name.toLowerCase()
  );
  if (existing) {
    existing.qty += qty;
  } else {
    inventory.push({ name, qty });
  }
  printLine(`[INV] Added ${qty} x ${name}.`, "output-system");
}

function cmdInvRemove(args) {
  if (!requireUser()) return;
  if (args.length < 1) {
    printLine("Usage: inv.remove <name> [quantity]", "output-warn");
    return;
  }
  const name = args[0];
  const qty = args[1] ? parseInt(args[1], 10) : 1;
  if (isNaN(qty) || qty <= 0) {
    printLine("Quantity must be a positive integer.", "output-error");
    return;
  }
  const inventory = getCurrentInventory();
  const idx = inventory.findIndex(
    (item) => item.name.toLowerCase() === name.toLowerCase()
  );
  if (idx === -1) {
    printLine("Item not found.", "output-error");
    return;
  }
  if (inventory[idx].qty <= qty) {
    inventory.splice(idx, 1);
    printLine(`[INV] Removed all of ${name}.`, "output-system");
  } else {
    inventory[idx].qty -= qty;
    printLine(
      `[INV] Removed ${qty} x ${name}. Remaining: ${inventory[idx].qty}.`,
      "output-system"
    );
  }
}

function cmdInvList() {
  if (!requireUser()) return;
  const inventory = getCurrentInventory();
  if (!inventory.length) {
    printLine("[INV] No items.", "output-muted");
    return;
  }
  printLine("[INV] Items:", "output-system");
  inventory.forEach((item) => {
    printLine(`- ${item.name} x ${item.qty}`);
  });
}

function cmdInvSearch(args) {
  if (!requireUser()) return;
  if (!args.length) {
    printLine("Usage: inv.search <term>", "output-warn");
    return;
  }
  const term = args.join(" ").toLowerCase();
  const inventory = getCurrentInventory();
  const results = inventory.filter((item) =>
    item.name.toLowerCase().includes(term)
  );
  if (!results.length) {
    printLine("[INV] No matching items.", "output-muted");
    return;
  }
  printLine("[INV] Search results:", "output-system");
  results.forEach((item) => {
    printLine(`- ${item.name} x ${item.qty}`);
  });
}

// Initialize prompt
setPrompt();
