import Image from 'next/image'; 

export default function Home() {
  return (
    <main>
      {/* NOME DO PROJETO */}
      <h1>InfoSchool</h1>
      <p>
        Bem-vindo ao projeto InfoSchool, desenvolvido para a disciplina de Métodos de Desenvolvimento de Software (MDS - 2025/2).
      </p>

      <hr />

      {/* SEÇÃO DE VISÃO GERAL */}
      <section>
        <h2>1. Visão Geral</h2>
        <p>
          O projeto InfoSchool tem como objetivo [ facilitar o acesso e a análise dos dados do Censo Escolar da Educação Básica. A iniciativa busca transformar informações complexas em relatórios visuais e intuitivos, permitindo que gestores, pesquisadores e a sociedade acompanhem de forma clara os principais indicadores da educação.

Através de dashboards interativos e de uma busca inteligente sobre os dados, o sistema oferece suporte na tomada de decisões e promove maior transparência na gestão escolar. Além disso, o enriquecimento dos metadados amplia a utilidade do portal, tornando-o uma ferramenta confiável e acessível para diferentes públicos.

Com isso, o InfoSchool contribui para aproximar dados educacionais da realidade das escolas, simplificando a compreensão das informações e apoiando a construção de políticas públicas mais eficazes.].
        </p>
        <p>
          Com uma experiência de usuário (UX) aprimorada, o produto permite:
        </p>
        <ul>
          <li>➡️ Visualizar de forma simples [funcionalidade 1].</li>
          <li>➡️ Solucionar problemas de [funcionalidade 2].</li>
          <li>➡️ Usar tecnologia para [funcionalidade 3].</li>
        </ul>
      </section>

      {/* SEÇÃO DE LINKS IMPORTANTES */}
      <section>
        <h2>2. Links Importantes</h2>
        <ul>
          <li>✳️ <a href="[LINK PARA O PROTÓTIPO]" target="_blank" rel="noopener noreferrer">Protótipo de alta fidelidade</a></li>
          <li>🗺️ <a href="[LINK PARA O STORY MAP]" target="_blank" rel="noopener noreferrer">Story Map Público</a></li>
          <li>📦 <a href="[LINK PARA O BOARD DO PROJETO]" target="_blank" rel="noopener noreferrer">Board do Projeto no GitHub</a></li>
        </ul>
      </section>

      {/* SEÇÃO DA EQUIPE */}
      <section className="equipe">
        <h2>3. Equipe</h2>
        <div className="equipe-container">

          {/* Membro 1 */}
          <div className="membro">
            {/* Para imagens locais, elas devem estar na pasta 'public' */}
            <img src="/foto-do-membro1.jpg" alt="Foto do Membro 1" width={120} height={120} />
            <h3>Nome do Membro 1</h3>
            <p>Função do Membro 1</p>
          </div>

          {/* Membro 2 */}
          <div className="membro">
            <img src="/foto-do-membro2.jpg" alt="Foto do Membro 2" width={120} height={120} />
            <h3>Nome do Membro 2</h3>
            <p>Função do Membro 2</p>
          </div>

        </div>
      </section>
    </main>
  );
}
