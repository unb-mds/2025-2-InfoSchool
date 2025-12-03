import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CredentialsManager {
  static getCredentialsPath() {
    const credentialsString = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    console.log("🔍 Verificando credenciais...");

    if (!credentialsString) {
      throw new Error("Variável GOOGLE_APPLICATION_CREDENTIALS não definida");
    }

    // DEBUG: Mostrar exatamente o que recebemos
    console.log("Primeiros 100 chars:", credentialsString.substring(0, 100));
    console.log(
      "Char 0:",
      credentialsString.charCodeAt(0),
      "=",
      credentialsString[0]
    );
    console.log(
      "Char 1:",
      credentialsString.charCodeAt(1),
      "=",
      credentialsString[1]
    );

    // CASO ESPECIAL: Render está enviando JSON com aspas e espaço inicial
    // A string parece: '  "type": "service_account", ...' (espaço + aspas)

    let cleanJson = credentialsString;

    // 1. Remove espaços no início
    cleanJson = cleanJson.trim();

    // 2. Se começar e terminar com aspas, remove-as
    if (cleanJson.startsWith('"') && cleanJson.endsWith('"')) {
      cleanJson = cleanJson.slice(1, -1);
      console.log("🔧 Removidas aspas externas");
    }

    // 3. Agora deve começar com '{' - se não, adicionamos
    if (!cleanJson.startsWith("{")) {
      console.log("⚠️  JSON não começa com {, ajustando...");
      // Tenta encontrar o início do JSON
      const jsonStart = cleanJson.indexOf("{");
      if (jsonStart > 0) {
        cleanJson = cleanJson.substring(jsonStart);
        console.log("✅ Encontrado JSON na posição", jsonStart);
      } else {
        // Se não encontrar, assume que é o JSON completo
        cleanJson = "{" + cleanJson;
      }
    }

    // 4. Se não terminar com '}', adiciona
    if (!cleanJson.endsWith("}")) {
      console.log("⚠️  JSON não termina com }, ajustando...");
      const jsonEnd = cleanJson.lastIndexOf("}");
      if (jsonEnd > 0) {
        cleanJson = cleanJson.substring(0, jsonEnd + 1);
      } else {
        cleanJson = cleanJson + "}";
      }
    }

    // 5. Substituir \n por quebras de linha reais
    cleanJson = cleanJson.replace(/\\n/g, "\n");

    // 6. Remover escapes de aspas
    cleanJson = cleanJson.replace(/\\"/g, '"');

    console.log(
      "JSON limpo (primeiros 100 chars):",
      cleanJson.substring(0, 100)
    );

    // 7. Validar JSON
    try {
      JSON.parse(cleanJson);
      console.log("✅ JSON válido após limpeza");
    } catch (error) {
      console.error("❌ JSON ainda inválido após limpeza:", error.message);
      throw error;
    }

    // 8. Criar arquivo
    const filePath = path.join(__dirname, "../../service-account.json");
    fs.writeFileSync(filePath, cleanJson, "utf8");

    console.log("✅ Arquivo criado:", filePath);

    // 9. Atualizar variável de ambiente
    process.env.GOOGLE_APPLICATION_CREDENTIALS = filePath;

    return filePath;
  }

  static initialize() {
    try {
      const path = this.getCredentialsPath();
      console.log("✅ Credenciais configuradas em:", path);
      return path;
    } catch (error) {
      console.error("❌ Falha nas credenciais:", error.message);
      return null;
    }
  }
}

export default CredentialsManager;
