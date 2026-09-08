let currentLang = 'ar';
let currentStep = 1;

// Language Translations Data
const translations = {
    ar: {
        appSubtitle: "منصة تشفير وفك تشفير النصوص التفاعلية",
        step1Title: "اختر لغة الواجهة والنص",
        step2Title: "اختر خوارزمية التشفير",
        step3Title: "اختر نوع العملية",
        step4Title: "إدخال البيانات والمفاتيح",
        step5Title: "النتيجة والخطوات الحسابية",
        btnNext: "المتابعة ➔",
        btnPrev: "⬅ السابق",
        btnExecute: "⚡ تنفيذ العملية",
        btnReset: "🔄 عملية جديدة",
        labelEncrypt: "تشفير (Encrypt)",
        labelDecrypt: "فك تشفير (Decrypt)",
        labelTextInput: "النص المدخل:",
        labelResult: "النتيجة النهائية:",
        labelExplanation: "💡 الخطوات الحسابية والتوضيح:",
        placeholderText: "أدخل النص هنا...",
        keys: {
            caesarShift: "مقدار الإزاحة (Shift Key):",
            multiKey: "مفتاح الضرب (Multiplicative Key - أعداد أولية نسبيًا مع 26):",
            vigenereKey: "المفتاح النصي (Text Key):",
            pboxPermutation: "مصفوفة التبديل (مثل: 3,1,4,2):",
            sboxKey: "مفتاح التبديل (S-Box Index/Key):",
            desKey: "مفتاح DES (8 حروف / 64-bit):",
            rsaP: "العدد الأولي P:",
            rsaQ: "العدد الأولي Q:",
            rsaE: "المفتاح العام E (Public Exponent):",
            dsaKey: "المفتاح الخاص/العام لـ DSA:"
        }
    },
    en: {
        appSubtitle: "Interactive Text Encryption & Decryption Platform",
        step1Title: "Select Language & Interface",
        step2Title: "Select Encryption Algorithm",
        step3Title: "Select Operation Type",
        step4Title: "Enter Input & Keys",
        step5Title: "Result & Mathematical Steps",
        btnNext: "Next ➔",
        btnPrev: "⬅ Back",
        btnExecute: "⚡ Execute Operation",
        btnReset: "🔄 New Operation",
        labelEncrypt: "Encrypt",
        labelDecrypt: "Decrypt",
        labelTextInput: "Input Text:",
        labelResult: "Final Result:",
        labelExplanation: "💡 Mathematical Steps & Explanation:",
        placeholderText: "Enter text here...",
        keys: {
            caesarShift: "Shift Amount (Key):",
            multiKey: "Multiplicative Key (Coprime with 26):",
            vigenereKey: "Text Key:",
            pboxPermutation: "Permutation Order (e.g. 3,1,4,2):",
            sboxKey: "S-Box Key/Index:",
            desKey: "DES Key (8 chars / 64-bit):",
            rsaP: "Prime Number P:",
            rsaQ: "Prime Number Q:",
            rsaE: "Public Exponent E:",
            dsaKey: "DSA Private/Public Key:"
        }
    }
};

// Switch Language Function
function selectLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    updateUIStrings();
    updateDynamicInputs();
}

function updateUIStrings() {
    const t = translations[currentLang];
    document.getElementById('app-subtitle').innerText = t.appSubtitle;
    document.getElementById('title-step-1').innerText = t.step1Title;
    document.getElementById('title-step-2').innerText = t.step2Title;
    document.getElementById('title-step-3').innerText = t.step3Title;
    document.getElementById('title-step-4').innerText = t.step4Title;
    document.getElementById('title-step-5').innerText = t.step5Title;

    document.getElementById('btn-next-1').innerText = t.btnNext;
    document.getElementById('btn-next-2').innerText = t.btnNext;
    document.getElementById('btn-next-3').innerText = t.btnNext;
    document.getElementById('btn-prev-2').innerText = t.btnPrev;
    document.getElementById('btn-prev-3').innerText = t.btnPrev;
    document.getElementById('btn-prev-4').innerText = t.btnPrev;
    document.getElementById('btn-prev-5').innerText = t.btnPrev;

    document.getElementById('btn-execute').innerText = t.btnExecute;
    document.getElementById('btn-reset').innerText = t.btnReset;

    document.getElementById('mode-encrypt-label').innerText = t.labelEncrypt;
    document.getElementById('mode-decrypt-label').innerText = t.labelDecrypt;
    document.getElementById('label-text-input').innerText = t.labelTextInput;
    document.getElementById('text-input').placeholder = t.placeholderText;
    document.getElementById('label-result').innerText = t.labelResult;
    document.getElementById('label-explanation').innerText = t.labelExplanation;
}

// Wizard Steps Navigation
function nextStep(step) {
    document.querySelectorAll('.step-card').forEach(card => card.classList.remove('active'));
    document.getElementById(`step-${step}`).classList.add('active');
    currentStep = step;
    
    // إجبار إعادة تحديث الحقول عند الوصول لخطوة المفاتيح
    if (step === 4) {
        updateDynamicInputs();
    }
}

function prevStep(step) {
    nextStep(step);
}

function resetWizard() {
    document.getElementById('text-input').value = '';
    document.getElementById('result-output').value = '';
    document.getElementById('math-steps').innerText = '';
    nextStep(1);
}

// Render Keys Inputs Based on Selected Algorithm
function updateDynamicInputs() {
    const selectedAlgoElem = document.querySelector('input[name="algorithm"]:checked');
    if (!selectedAlgoElem) return;
    
    const selectedAlgo = selectedAlgoElem.value;
    const container = document.getElementById('dynamic-keys-container');
    const k = translations[currentLang].keys;
    container.innerHTML = '';

    if (selectedAlgo === 'caesar') {
        container.innerHTML = `
            <div class="form-group">
                <label>${k.caesarShift}</label>
                <input type="number" id="key-shift" value="3" min="1" max="25">
            </div>`;
    } else if (selectedAlgo === 'multiplicative') {
        container.innerHTML = `
            <div class="form-group">
                <label>${k.multiKey}</label>
                <input type="number" id="key-multi" value="7">
            </div>`;
    } else if (selectedAlgo === 'vigenere') {
        container.innerHTML = `
            <div class="form-group">
                <label>${k.vigenereKey}</label>
                <input type="text" id="key-vigenere" value="KEY" placeholder="KEY">
            </div>`;
    } else if (selectedAlgo === 'pbox') {
        container.innerHTML = `
            <div class="form-group">
                <label>${k.pboxPermutation}</label>
                <input type="text" id="key-pbox" value="3,1,4,2">
            </div>`;
    } else if (selectedAlgo === 'sbox') {
        container.innerHTML = `
            <div class="form-group">
                <label>${k.sboxKey}</label>
                <input type="number" id="key-sbox" value="2">
            </div>`;
    } else if (selectedAlgo === 'des') {
        container.innerHTML = `
            <div class="form-group">
                <label>${k.desKey}</label>
                <input type="text" id="key-des" value="8bytekey" maxlength="8">
            </div>`;
    } else if (selectedAlgo === 'rsa') {
        container.innerHTML = `
            <div class="form-group">
                <label>${k.rsaP}</label>
                <input type="number" id="key-rsa-p" value="61">
            </div>
            <div class="form-group">
                <label>${k.rsaQ}</label>
                <input type="number" id="key-rsa-q" value="53">
            </div>
            <div class="form-group">
                <label>${k.rsaE}</label>
                <input type="number" id="key-rsa-e" value="17">
            </div>`;
    } else if (selectedAlgo === 'dsa') {
        container.innerHTML = `
            <div class="form-group">
                <label>${k.dsaKey}</label>
                <input type="text" id="key-dsa" value="dsa_secret_key">
            </div>`;
    }
}

// Process Backend API Request
async function processCrypto() {
    const text = document.getElementById('text-input').value.trim();
    if (!text) {
        alert(currentLang === 'ar' ? 'الرجاء إدخال النص أولاً' : 'Please enter text first');
        return;
    }

    const algo = document.querySelector('input[name="algorithm"]:checked').value;
    const mode = document.querySelector('input[name="operation"]:checked').value;

    // Collect Keys safely
    let keys = {};
    if (algo === 'caesar') keys.shift = parseInt(document.getElementById('key-shift')?.value || 3);
    else if (algo === 'multiplicative') keys.key = parseInt(document.getElementById('key-multi')?.value || 7);
    else if (algo === 'vigenere') keys.key = document.getElementById('key-vigenere')?.value || 'KEY';
    else if (algo === 'pbox') keys.perm = document.getElementById('key-pbox')?.value || '3,1,4,2';
    else if (algo === 'sbox') keys.key = parseInt(document.getElementById('key-sbox')?.value || 2);
    else if (algo === 'des') keys.key = document.getElementById('key-des')?.value || '8bytekey';
    else if (algo === 'rsa') {
        keys.p = parseInt(document.getElementById('key-rsa-p')?.value || 61);
        keys.q = parseInt(document.getElementById('key-rsa-q')?.value || 53);
        keys.e = parseInt(document.getElementById('key-rsa-e')?.value || 17);
    } else if (algo === 'dsa') keys.key = document.getElementById('key-dsa')?.value || 'dsa_secret_key';

    const payload = {
        text: text,
        algorithm: algo,
        mode: mode,
        keys: keys,
        lang: currentLang
    };

    try {
        const response = await fetch('/api/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('result-output').value = data.result;
            document.getElementById('math-steps').innerText = data.explanation;
            nextStep(5);
        } else {
            alert(data.error || 'حدث خطأ أثناء المعالجة');
        }
    } catch (err) {
        alert(currentLang === 'ar' ? 'خطأ في الاتصال بالخادم. تأكد من تشغيل app.py' : 'Server connection error');
    }
}

// Modern Copy Function
async function copyResult() {
    const resultText = document.getElementById('result-output').value;
    if (!resultText) return;
    
    try {
        await navigator.clipboard.writeText(resultText);
        alert(currentLang === 'ar' ? 'تم النسخ بنجاح!' : 'Copied successfully!');
    } catch (err) {
        const input = document.getElementById('result-output');
        input.select();
        document.execCommand('copy');
        alert(currentLang === 'ar' ? 'تم النسخ بنجاح!' : 'Copied successfully!');
    }
}

// Initial Call
document.addEventListener('DOMContentLoaded', () => {
    updateDynamicInputs();
});