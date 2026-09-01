// script.js
// Live password strength checker: validates a set of criteria, scores the
// password, updates a color-coded strength bar, and shows a rough estimate
// of how long it would take to brute-force.

// ELEMENTS
const passwordInput = document.getElementById("passwordInput");
const toggleVisibilityBtn = document.getElementById("toggleVisibilityBtn");
const strengthBar = document.getElementById("strengthBar");
const strengthLabel = document.getElementById("strengthLabel");
const crackTimeLabel = document.getElementById("crackTimeLabel");

const ruleElements = {
    length: document.getElementById("rule-length"),
    lowercase: document.getElementById("rule-lowercase"),
    uppercase: document.getElementById("rule-uppercase"),
    number: document.getElementById("rule-number"),
    special: document.getElementById("rule-special")
};

// STRENGTH TIERS: [minCriteriaMet, label, barColorClass, widthPercent]
const STRENGTH_TIERS = [
    { min: 0, label: "Enter a password", color: "bg-gray-300", width: 0, textColor: "text-gray-400" },
    { min: 1, label: "Very Weak", color: "bg-red-500", width: 20, textColor: "text-red-600" },
    { min: 2, label: "Weak", color: "bg-orange-500", width: 40, textColor: "text-orange-600" },
    { min: 3, label: "Fair", color: "bg-yellow-500", width: 60, textColor: "text-yellow-600" },
    { min: 4, label: "Strong", color: "bg-blue-500", width: 80, textColor: "text-blue-600" },
    { min: 5, label: "Very Strong", color: "bg-green-500", width: 100, textColor: "text-green-600" }
];

// CHECK EACH CRITERIA RULE
function checkRules(password) {
    return {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };
}

// COUNT HOW MANY RULES ARE MET
function countMetRules(rules) {
    return Object.values(rules).filter(Boolean).length;
}

// FIGURE OUT WHICH STRENGTH TIER APPLIES
function getStrengthTier(password, metCount) {
    if (password.length === 0) {
        return STRENGTH_TIERS[0];
    }
    // find the highest tier whose "min" is <= metCount
    let tier = STRENGTH_TIERS[1];
    for (let i = 0; i < STRENGTH_TIERS.length; i++) {
        if (metCount >= STRENGTH_TIERS[i].min) {
            tier = STRENGTH_TIERS[i];
        }
    }
    return tier;
}

// ESTIMATE THE CHARACTER POOL SIZE BASED ON WHAT'S USED
function estimatePoolSize(rules) {
    let poolSize = 0;
    if (rules.lowercase) poolSize += 26;
    if (rules.uppercase) poolSize += 26;
    if (rules.number) poolSize += 10;
    if (rules.special) poolSize += 32; // rough count of common special characters
    return poolSize;
}

// ROUGH BRUTE-FORCE TIME ESTIMATE
// Assumes a fast offline attack at 10 billion guesses/second. This is meant
// to give an illustrative sense of strength, not a precise security audit.
const GUESSES_PER_SECOND = 10_000_000_000;

function estimateCrackTime(password, rules) {
    if (password.length === 0) {
        return "";
    }

    const poolSize = estimatePoolSize(rules);
    if (poolSize === 0) {
        return "";
    }

    const entropyBits = password.length * Math.log2(poolSize);
    const guesses = Math.pow(2, entropyBits);
    const seconds = guesses / GUESSES_PER_SECOND;

    return "Est. crack time: " + formatDuration(seconds);
}

// FORMAT A NUMBER OF SECONDS INTO A HUMAN-READABLE STRING
function formatDuration(seconds) {
    if (seconds < 1) return "instantly";
    if (seconds < 60) return Math.round(seconds) + " seconds";

    const minutes = seconds / 60;
    if (minutes < 60) return Math.round(minutes) + " minutes";

    const hours = minutes / 60;
    if (hours < 24) return Math.round(hours) + " hours";

    const days = hours / 24;
    if (days < 365) return Math.round(days) + " days";

    const years = days / 365;
    if (years < 1000) return Math.round(years) + " years";
    if (years < 1_000_000) return Math.round(years / 1000) + "k years";
    if (years < 1_000_000_000) return Math.round(years / 1_000_000) + " million years";

    return "centuries";
}

// UPDATE A SINGLE CHECKLIST ROW
function updateRuleRow(element, isMet) {
    const icon = element.querySelector(".rule-icon");

    if (isMet) {
        icon.textContent = "✓";
        element.classList.remove("text-gray-400");
        element.classList.add("text-green-600", "font-medium");
    } else {
        icon.textContent = "○";
        element.classList.add("text-gray-400");
        element.classList.remove("text-green-600", "font-medium");
    }
}

// MAIN UPDATE FUNCTION — RUNS ON EVERY KEYSTROKE
function updateStrength() {
    const password = passwordInput.value;
    const rules = checkRules(password);
    const metCount = countMetRules(rules);
    const tier = getStrengthTier(password, metCount);

    // update the bar
    strengthBar.style.width = tier.width + "%";
    strengthBar.className = "h-2.5 rounded-full transition-all duration-300 ease-out " + tier.color;

    // update the label
    strengthLabel.textContent = tier.label;
    strengthLabel.className = "text-sm font-semibold " + tier.textColor;

    // update crack time estimate
    crackTimeLabel.textContent = estimateCrackTime(password, rules);

    // update the checklist rows
    updateRuleRow(ruleElements.length, rules.length);
    updateRuleRow(ruleElements.lowercase, rules.lowercase);
    updateRuleRow(ruleElements.uppercase, rules.uppercase);
    updateRuleRow(ruleElements.number, rules.number);
    updateRuleRow(ruleElements.special, rules.special);
}

// SHOW / HIDE PASSWORD TEXT
function toggleVisibility() {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleVisibilityBtn.textContent = "Hide";
    } else {
        passwordInput.type = "password";
        toggleVisibilityBtn.textContent = "Show";
    }
}

// EVENT LISTENERS
passwordInput.addEventListener("input", updateStrength);

// INITIAL STATE
updateStrength();

