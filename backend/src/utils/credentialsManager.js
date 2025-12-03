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

    // DEBUG: Mostrar início da string
    console.log("Primeiros 50 chars:", credentialsString.substring(0, 50));
    console.log(
      "É JSON?",
      credentialsString.trim().startsWith("{") ||
        credentialsString.includes("type")
    );

    // Caso 1: Já é JSON válido (mesmo com espaços)
    const trimmed = credentialsString.trim();

    // Verifica se parece JSON (começa com { ou tem "type":)
    if (trimmed.startsWith("{") || trimmed.includes('"type":')) {
      console.log("📝 JSON detectado, criando arquivo...");

      const filePath = path.join(__dirname, "../../service-account.json");

      try {
        // Limpar o JSON - método robusto
        let cleanJson = credentialsString;

        // Remove espaços/aspas no início se existirem
        cleanJson = cleanJson.trim();
        if (cleanJson.startsWith('"') && cleanJson.endsWith('"')) {
          cleanJson = cleanJson.slice(1, -1);
        }

        // Converte \n para quebras de linha reais
        cleanJson = cleanJson.replace(/\\n/g, "\n");

        // Remove escapes de aspas
        cleanJson = cleanJson.replace(/\\"/g, '"');

        // Valida JSON
        JSON.parse(cleanJson);

        // Escreve arquivo
        fs.writeFileSync(filePath, cleanJson, "utf8");

        console.log("✅ Arquivo criado:", filePath);
        console.log("Tamanho do arquivo:", fs.statSync(filePath).size, "bytes");

        // Atualiza variável de ambiente
        process.env.GOOGLE_APPLICATION_CREDENTIALS = filePath;

        return filePath;
      } catch (error) {
        console.error("❌ Erro ao processar JSON:", error.message);
        console.error(
          "Primeiros 200 chars do JSON:",
          credentialsString.substring(0, 200)
        );
        throw error;
      }
    }

    // Caso 2: Já é caminho de arquivo
    if (fs.existsSync(credentialsString)) {
      console.log("✅ Usando arquivo existente:", credentialsString);
      return credentialsString;
    }

    // Caso 3: Fallback
    const localPath = path.join(__dirname, "../../service-account.json");
    if (fs.existsSync(localPath)) {
      console.log("⚠️  Usando arquivo local:", localPath);
      return localPath;
    }

    throw new Error(
      `Credenciais não configuradas. Tipo: ${typeof credentialsString}, Início: ${credentialsString.substring(
        0,
        50
      )}`
    );
  }

  static initialize() {
    try {
      const path = this.getCredentialsPath();
      console.log("✅ Credenciais configuradas em:", path);
      return path;
    } catch (error) {
      console.error("❌ Falha nas credenciais:", error.message);
      throw error;
    }
  }
}

export default CredentialsManager;
