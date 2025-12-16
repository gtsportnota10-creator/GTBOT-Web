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
        <div class="campo modelagem">
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
    `;
    
    // Cria o botão "Adicionar Item" dinamicamente
    const botaoAdicionarItem = document.createElement("button");
    botaoAdicionarItem.className = "btn-sec";
    botaoAdicionarItem.textContent = "➕ Adicionar Item";
    botaoAdicionarItem.addEventListener("click", () => adicionarLinha(botaoAdicionarItem));
    
    // Cria o botão "Enviar no WhatsApp" para cada lista
    const botaoEnviarWhatsapp = document.createElement("button");
    botaoEnviarWhatsapp.className = "btn-main compartilhar";
    botaoEnviarWhatsapp.textContent = "Enviar no WhatsApp";
    botaoEnviarWhatsapp.addEventListener("click", () => compartilharPedidoLista(card));
    
    // Adiciona os botões no card
    card.appendChild(botaoAdicionarItem);
    card.appendChild(botaoEnviarWhatsapp);
    
    // Insere antes do botão "Adicionar Nova Lista"
    const botaoNovaLista = document.querySelector("button[onclick='adicionarNovaLista()']");
    app.insertBefore(card, botaoNovaLista);
}

// Função para gerar arquivo de todas as listas
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

// Função para compartilhar uma lista específica no WhatsApp
function compartilharPedidoLista(card) {
    const nomeCliente = document.getElementById("clienteNome").value || "";
    const telefone = document.getElementById("clienteTelefone").value || "";
    
    let texto = "DADOS DO CLIENTE;\n";
    texto += `NOME;${nomeCliente}\nTELEFONE;${telefone}\n;\n`;

    const modelagem = card.querySelector(".modelagem").value || "";
    texto += `MODELAGEM;${modelagem}\n`;
    texto += "ITEM;TAMANHO;NÚMERO;QUANTIDADE\n";

    const linhas = card.querySelectorAll(".lista-itens tr");
    let temItem = false;

    linhas.forEach(linha => {
        const inputs = linha.querySelectorAll("input");
        const item = inputs[0].value || "";
        const tamanho = inputs[1].value || "";
        const numero = inputs[2].value || "";
        const quantidade = inputs[3].value || "";

        if (item || tamanho || numero || quantidade) {
            temItem = true;
            texto += `${item};${tamanho};${numero};${quantidade}\n`;
        }
    });

    if (!temItem) {
        alert("Preencha pelo menos um item na lista.");
        return;
    }

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
}

// Inicializa a primeira linha da primeira lista ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    const primeiraLista = document.querySelector(".lista-pedido .btn-sec");
    adicionarLinha(primeiraLista);

    // Adiciona botão "Enviar no WhatsApp" para a primeira lista
    const primeiraCard = document.querySelector(".lista-pedido");
    const botaoEnviarWhatsapp = document.createElement("button");
    botaoEnviarWhatsapp.className = "btn-main compartilhar";
    botaoEnviarWhatsapp.textContent = "Enviar no WhatsApp";
    botaoEnviarWhatsapp.addEventListener("click", () => compartilharPedidoLista(primeiraCard));
    primeiraCard.appendChild(botaoEnviarWhatsapp);
});
