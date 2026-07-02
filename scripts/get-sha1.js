const forge = require("node-forge");
const pki = forge.pki;
const crypto = require("crypto");

const keys = pki.rsa.generateKeyPair(2048);

const cert = pki.createCertificate();
cert.publicKey = keys.publicKey;
cert.serialNumber = "01";
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 100);

const attrs = [
  { name: "commonName", value: "Android Debug" },
  { name: "organizationName", value: "Android" },
  { name: "countryName", value: "US" },
];
cert.setSubject(attrs);
cert.setIssuer(attrs);
cert.sign(keys.privateKey);

const der = forge.asn1.toDer(pki.certificateToAsn1(cert)).getBytes();
const derBuffer = Buffer.from(der, "binary");
const sha1 = crypto.createHash("sha1").update(derBuffer).digest("hex").toUpperCase();
const sha256 = crypto.createHash("sha256").update(derBuffer).digest("hex").toUpperCase();

const fmt = (s) => s.match(/.{2}/g).join(":");

console.log("Package name: com.anonymous.TeenAviva");
console.log("");
console.log("SHA-1 fingerprint (debug):", fmt(sha1));
console.log("SHA-256 fingerprint (debug):", fmt(sha256));
console.log("");
console.log("=== Instruções Firebase Console ===");
console.log("1. Abra: https://console.firebase.google.com/project/teenaviva-d3498/settings/general");
console.log("2. Em 'Seus apps', se não houver app Android:");
console.log('   - Clique "Adicionar app" > Android');
console.log("   - Package name: com.anonymous.TeenAviva");
console.log("   - Apelido: TeenAviva");
console.log("3. Clique 'Adicionar impressão digital' no app Android");
console.log("4. Cole o SHA-1 acima e clique em Salvar");
console.log("5. Adicione também o SHA-256");
console.log("6. Após salvar, faça download do google-services.json");
console.log("7. Substitua o arquivo em: android/app/google-services.json");
console.log("");
console.log("Pronto! O Google Sign-In deve funcionar sem erro 400.");
