// Cifrar b64
export function encryptBase64(text: string) {
  return Buffer.from(text, "utf8").toString("base64");
}
// Descifrar b64
export function decryptBase64(encodedText: string) {
  return Buffer.from(encodedText, "base64").toString("utf8");
}