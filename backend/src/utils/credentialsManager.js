import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CredentialsManager {
  static getCredentialsPath() {
    let credentialsString = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    console.log("🔍 Verificando credenciais...");

    if (!credentialsString) {
      throw new Error("Variável GOOGLE_APPLICATION_CREDENTIALS não definida");
    }

    // DEBUG: Mostrar início
    console.log(
      "Primeiros 100 chars CRUS:",
      credentialsString.substring(0, 100)
    );
    console.log("Primeiro char código:", credentialsString.charCodeAt(0));

    // 1. Remover TODOS os espaços/aspas problemáticos
    credentialsString = credentialsString.trim();

    // 2. Se a string inteira está entre aspas, remover
    if (credentialsString.startsWith('"') && credentialsString.endsWith('"')) {
      credentialsString = credentialsString.slice(1, -1);
    }

    // 3. Se ainda não começa com '{', adicionar
    if (!credentialsString.startsWith("{")) {
      console.log("⚠️  Adicionando { no início...");
      credentialsString = "{" + credentialsString;
    }

    // 4. Se ainda não termina com '}', adicionar
    if (!credentialsString.endsWith("}")) {
      console.log("⚠️  Adicionando } no final...");
      credentialsString = credentialsString + "}";
    }

    // 5. Corrigir problemas comuns
    credentialsString = credentialsString
      .replace(/\\n/g, "\n") // Converte \n para quebras reais
      .replace(/\\"/g, '"') // Remove escapes de aspas
      .replace(/\\'/g, "'") // Remove escapes de apóstrofos
      .replace(/\\\\/g, "\\"); // Remove escapes duplos

    console.log(
      "JSON após limpeza (primeiros 100 chars):",
      credentialsString.substring(0, 100)
    );

    // 6. Validar JSON
    try {
      const parsed = JSON.parse(credentialsString);
      console.log("✅ JSON válido! Tipo:", parsed.type);
    } catch (error) {
      console.error("❌ JSON INVÁLIDO! Erro:", error.message);
      console.error(
        "String problemática (200 chars):",
        credentialsString.substring(0, 200)
      );
      throw error;
    }

    // 7. Criar arquivo
    const filePath = path.join(__dirname, "../../service-account.json");
    fs.writeFileSync(filePath, credentialsString, "utf8");

    console.log("✅ Arquivo criado com sucesso:", filePath);

    // 8. Atualizar variável de ambiente
    process.env.GOOGLE_APPLICATION_CREDENTIALS = filePath;

    return filePath;
  }

  static initialize() {
    try {
      const path = this.getCredentialsPath();
      console.log("✅ Credenciais configuradas com sucesso");
      return path;
    } catch (error) {
      console.error(
        "❌ CRÍTICO: Falha nas credenciais - BigQuery NÃO funcionará"
      );
      console.error("ERRO:", error.message);
      return null;
    }
  }
}

export default CredentialsManager;
