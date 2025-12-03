import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CredentialsManager {
  static getCredentialsPath() {
    const credentialsString = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    console.log("🔍 Verificando credenciais...");

    // Caso 1: Já é um caminho de arquivo que existe
    if (credentialsString && fs.existsSync(credentialsString)) {
      console.log("✅ Usando arquivo existente:", credentialsString);
      return credentialsString;
    }

    // Caso 2: É JSON string (Render)
    if (credentialsString && credentialsString.trim().startsWith("{")) {
      console.log("📝 JSON detectado, criando arquivo...");

      const filePath = path.join(__dirname, "../../service-account.json");

      try {
        // Limpar o JSON
        const cleanJson = credentialsString
          .replace(/\\n/g, "\n") // Converte \n para quebra de linha real
          .replace(/\\"/g, '"') // Remove escapes de aspas
          .replace(/^"|"$/g, ""); // Remove aspas no início/fim se houver

        // Validar JSON
        JSON.parse(cleanJson);

        // Escrever arquivo
        fs.writeFileSync(filePath, cleanJson, "utf8");

        console.log("✅ Arquivo criado:", filePath);

        // Atualizar a variável de ambiente
        process.env.GOOGLE_APPLICATION_CREDENTIALS = filePath;

        return filePath;
      } catch (error) {
        console.error("❌ Erro ao processar JSON:", error.message);
        throw error;
      }
    }

    // Caso 3: Fallback para arquivo local
    const localPath = path.join(__dirname, "../../service-account.json");
    if (fs.existsSync(localPath)) {
      console.log("⚠️  Usando arquivo local:", localPath);
      return localPath;
    }

    throw new Error("Credenciais do Google não configuradas");
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
