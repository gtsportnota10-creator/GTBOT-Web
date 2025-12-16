let contadorListas = 1; // Contador para numerar as listas

// Função para adicionar uma linha em uma lista específica
function adicionarLinha(botao) {
    const card = botao.closest(".card");
    const lista = card.querySelector(".lista-itens");
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td><input placeholder="Ex: João"></td>
        <td><input placeholder="G"></td>
        <td><input placeholder="10"></td>
        <td><input type="number" min="1" placeholder="1"></td>
        <td><button class="btn-remove" onclick="this.closest('tr').remove()">❌</button></td>
    `;
    lista.appendChild(tr);

    // Foco automático no primeiro input da nova linha
    const primeiroInput = tr.querySelector("input");
    setTimeout(() => primeiroInput.focus(), 50);
}

// Função para criar uma nova lista
function adicionarNovaLista() {
    contadorListas++;
    
    const app = document.querySelector(".app");
    
    const card = document.createElement("section");
    card.className = "card lista-pedido";
    
    card.innerHTML = `
        <h2>Lista de Pedido ${contadorListas}</h2>
        <div class="campo">
            <label>Modelagem</label>
            <input type="text" class="modelagem" placeholder="Ex: Conjunto Feminino">
        </div>
        <div class="tabela-wrapper">
            <table>
                <thead>
                    <tr>
                        <th class="col-nome">Nome</th>
                        <th class="col-tam">Tam</th>
                        <th class="col-num">Nº</th>
                        <th class="col-qtd">Quantidade</th>
                        <th class="col-del"></th>
                    </tr>
                </thead>
                <tbody class="lista-itens"></tbody>
            </table>
        </div>
        <button class="btn-sec" onclick="adicionarLinha(this)">➕ Adicionar Item</button>
    `;
    
    // Insere antes do botão "Adicionar Nova Lista"
    const botaoNovaLista = document.querySelector("button[onclick='adicionarNovaLista()']");
    app.insertBefore(card, botaoNovaLista);
}

// Função para gerar arquivo de **todas** as listas
function gerarArquivo() {
    let conteudo = "DADOS DO CLIENTE;\n";
    const nomeCliente = document.getElementById("clienteNome").value || "";
    const telefone = document.getElementById("clienteTelefone").value || "";
    conteudo += `NOME;${nomeCliente}\nTELEFONE;${telefone}\n;\n`;

    const cards = document.querySelectorAll(".lista-pedido");
    cards.forEach((card, idx) => {
        const modelagem = card.querySelector(".modelagem").value || "";
        conteudo += `MODELAGEM;${modelagem}\n`;
        conteudo += "ITEM;TAMANHO;NÚMERO;QUANTIDADE\n";

        const linhas = card.querySelectorAll(".lista-itens tr");
        linhas.forEach(linha => {
            const inputs = linha.querySelectorAll("input");
            const item = inputs[0].value || "";
            const tamanho = inputs[1].value || "";
            const numero = inputs[2].value || "";
            const quantidade = inputs[3].value || "";

            if (item || tamanho || numero || quantidade) {
                conteudo += `${item};${tamanho};${numero};${quantidade}\n`;
            }
        });
        conteudo += ";\n"; // separador de listas
    });

    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "GTBOT_DADOS_PACOTE.gtb";
    a.click();
}

// Função para compartilhar no WhatsApp todas as listas
function compartilharPedido() {
    let texto = "DADOS DO CLIENTE;\n";
    const nomeCliente = document.getElementById("clienteNome").value || "";
    const telefone = document.getElementById("clienteTelefone").value || "";
    texto += `NOME;${nomeCliente}\nTELEFONE;${telefone}\n;\n`;

    const cards = document.querySelectorAll(".lista-pedido");
    cards.forEach((card, idx) => {
        const modelagem = card.querySelector(".modelagem").value || "";
        texto += `MODELAGEM;${modelagem}\n`;
        texto += "ITEM;TAMANHO;NÚMERO;QUANTIDADE\n";

        const linhas = card.querySelectorAll(".lista-itens tr");
        linhas.forEach(linha => {
            const inputs = linha.querySelectorAll("input");
            const item = inputs[0].value || "";
            const tamanho = inputs[1].value || "";
            const numero = inputs[2].value || "";
            const quantidade = inputs[3].value || "";

            if (item || tamanho || numero || quantidade) {
                texto += `${item};${tamanho};${numero};${quantidade}\n`;
            }
        });
        texto += ";\n";
    });

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    if (navigator.share) {
        navigator.share({ title: "Pedido GTBOT", text: texto })
            .catch(() => window.open(url, '_blank'));
    } else {
        window.open(url, '_blank');
    }
}

// Inicia a primeira linha da primeira lista
document.addEventListener("DOMContentLoaded", () => {
    const primeiraLista = document.querySelector(".lista-pedido .btn-sec");
    adicionarLinha(primeiraLista);
});
