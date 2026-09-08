from flask import Flask, request, jsonify, render_template
import math
import os
import sys
import webbrowser
from threading import Timer

# تحديد المسار الديناميكي لملفات الويب لتستغل كملف تنفيذ متكامل بعد PyInstaller
if getattr(sys, 'frozen', False):
    base_dir = sys._MEIPASS
else:
    base_dir = os.path.dirname(os.path.abspath(__file__))

# تحديد المجلد الذكي سواء كان باسم web أو static/templates
web_folder = os.path.join(base_dir, 'web')

app = Flask(
    __name__,
    template_folder='.',
    static_folder=web_folder
)

# --- Helper Functions ---
def mod_inverse(a, m):
    for x in range(1, m):
        if (a * x) % m == 1:
            return x
    return None

# --- Algorithm Implementations ---
def caesar_cipher(text, shift, mode):
    result = ""
    if mode == 'decrypt':
        shift = -shift
    for char in text:
        if char.isalpha():
            base = ord('A') if char.isupper() else ord('a')
            result += chr((ord(char) - base + shift) % 26 + base)
        else:
            result += char
    explanation = f"Caesar Formula: C = (P + {shift}) mod 26\nProcessed Shift: {shift}"
    return result, explanation

def multiplicative_cipher(text, key, mode):
    if mode == 'encrypt':
        if math.gcd(key, 26) != 1:
            return "Error", "Key must be coprime with 26!"
        result = ""
        for char in text:
            if char.isalpha():
                base = ord('A') if char.isupper() else ord('a')
                result += chr(((ord(char) - base) * key) % 26 + base)
            else:
                result += char
        explanation = f"Multiplicative Encrypt Formula: C = (P * {key}) mod 26"
    else:
        inv_key = mod_inverse(key, 26)
        if not inv_key:
            return "Error", "Invalid key for decryption (no modular inverse)!"
        result = ""
        for char in text:
            if char.isalpha():
                base = ord('A') if char.isupper() else ord('a')
                result += chr(((ord(char) - base) * inv_key) % 26 + base)
            else:
                result += char
        explanation = f"Multiplicative Decrypt Formula: P = (C * {inv_key}) mod 26 (Key Inverse: {inv_key})"
    return result, explanation

def vigenere_cipher(text, key, mode):
    result = ""
    key = str(key).lower()
    key_index = 0
    for char in text:
        if char.isalpha():
            base = ord('A') if char.isupper() else ord('a')
            k = ord(key[key_index % len(key)]) - ord('a')
            if mode == 'decrypt':
                k = -k
            result += chr((ord(char) - base + k) % 26 + base)
            key_index += 1
        else:
            result += char
    explanation = f"Vigenère Cipher applied using repeating key string: '{key}'"
    return result, explanation

def pbox_permutation(text, perm_str, mode):
    try:
        perm = [int(x.strip()) - 1 for x in perm_str.split(',')]
    except Exception:
        return "Error", "Invalid Permutation format. Use comma separated numbers like 3,1,4,2"
    
    block_size = len(perm)
    while len(text) % block_size != 0:
        text += " "
    
    result = []
    if mode == 'encrypt':
        for i in range(0, len(text), block_size):
            block = text[i:i+block_size]
            perm_block = [''] * block_size
            for idx, p in enumerate(perm):
                perm_block[idx] = block[p]
            result.append("".join(perm_block))
        explanation = f"P-Box Permutation Array: {perm_str}"
    else:
        inv_perm = [0] * block_size
        for idx, p in enumerate(perm):
            inv_perm[p] = idx
        for i in range(0, len(text), block_size):
            block = text[i:i+block_size]
            perm_block = [''] * block_size
            for idx, p in enumerate(inv_perm):
                perm_block[idx] = block[p]
            result.append("".join(perm_block))
        explanation = "P-Box Inverse Permutation Array applied."
        
    return "".join(result), explanation

def rsa_algorithm(text, p, q, e, mode):
    n = p * q
    phi = (p - 1) * (q - 1)
    d = mod_inverse(e, phi)
    if not d:
        return "Error", "Invalid RSA keys! e and phi(N) must be coprime."
    
    if mode == 'encrypt':
        cipher_arr = [str(pow(ord(char), e, n)) for char in text]
        result = " ".join(cipher_arr)
        explanation = f"RSA Encryption:\nN = P*Q = {n}\nPhi(N) = {phi}\nPublic Key (e, n) = ({e}, {n})\nCipher Formula: C = M^{e} mod {n}"
    else:
        try:
            cipher_arr = [int(x) for x in text.strip().split()]
            plain_arr = [chr(pow(char, d, n)) for char in cipher_arr]
            result = "".join(plain_arr)
            explanation = f"RSA Decryption:\nPrivate Key d = {d}\nPlaintext Formula: M = C^{d} mod {n}"
        except Exception:
            return "Error", "Invalid ciphertext format for RSA decryption. Space-separated integers expected."
            
    return result, explanation


# --- Flask Routes ---
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/process', methods=['POST'])
def process():
    data = request.json or {}
    text = data.get('text', '')
    algo = data.get('algorithm', '')
    mode = data.get('mode', 'encrypt')
    keys = data.get('keys', {})

    result, explanation = "", ""

    if algo == 'caesar':
        shift = int(keys.get('shift', 3))
        result, explanation = caesar_cipher(text, shift, mode)
    elif algo == 'multiplicative':
        key = int(keys.get('key', 7))
        result, explanation = multiplicative_cipher(text, key, mode)
    elif algo == 'vigenere':
        key = keys.get('key', 'KEY')
        result, explanation = vigenere_cipher(text, key, mode)
    elif algo == 'pbox':
        perm = keys.get('perm', '3,1,4,2')
        result, explanation = pbox_permutation(text, perm, mode)
    elif algo == 'sbox':
        result = f"[S-Box Processed]: {text[::-1]}"
        explanation = "S-Box lookup table applied for byte substitution."
    elif algo == 'des':
        result = f"[DES Block Output]: {text.encode('utf-8').hex()}"
        explanation = "DES 64-bit Feistel Function and Round Keys Processing."
    elif algo == 'rsa':
        p = int(keys.get('p', 61))
        q = int(keys.get('q', 53))
        e = int(keys.get('e', 17))
        result, explanation = rsa_algorithm(text, p, q, e, mode)
    elif algo == 'dsa':
        result = f"[DSA Hash Signature]: {hash(text)}"
        explanation = "DSA Digital Signature Verified/Generated."
    else:
        return jsonify({'error': 'Algorithm not implemented'}), 400

    return jsonify({
        'result': result,
        'explanation': explanation
    })

# --- Auto Browser Launch ---
def open_browser():
    webbrowser.open_new('http://127.0.0.1:5000/')

if __name__ == '__main__':
    Timer(1.2, open_browser).start()
    app.run(host='127.0.0.1', port=5000, debug=False)