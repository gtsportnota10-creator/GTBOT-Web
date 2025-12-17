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
            <input type="text" class="modelagem-valor" placeholder="Ex: BabyLook">
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
    
    // Botão "Fechar Lista"
    const botaoFecharLista = document.createElement("button");
    botaoFecharLista.className = "btn-remove";
    botaoFecharLista.textContent = "Fechar Lista";
    botaoFecharLista.style.marginTop = "10px";
    botaoFecharLista.style.marginLeft = "10px";
    botaoFecharLista.addEventListener("click", () => {
        if (confirm("Deseja realmente fechar esta lista?")) {
            card.remove();
        }
    });

    // Adiciona os botões no card
    card.appendChild(botaoAdicionarItem);
    card.appendChild(botaoEnviarWhatsapp);
    card.appendChild(botaoFecharLista);
    
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
    cards.forEach((card) => {
        // Alterado para buscar .modelagem-valor
        const inputModelagem = card.querySelector(".modelagem-valor");
        const modelagem = inputModelagem ? inputModelagem.value : "";
        
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
        conteudo += ";\n"; 
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

    // Alterado para buscar .modelagem-valor
    const inputModelagem = card.querySelector(".modelagem-valor");
    const modelagem = inputModelagem ? inputModelagem.value : "";
    
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

document.addEventListener("DOMContentLoaded", () => {
    const primeiraCard = document.querySelector(".lista-pedido");
    
    // Garante que o input da primeira lista também tenha a classe correta
    const inputPrimeira = primeiraCard.querySelector("input.modelagem");
    if(inputPrimeira) {
        inputPrimeira.classList.remove("modelagem");
        inputPrimeira.classList.add("modelagem-valor");
    }

    const botaoAdicionarItem = primeiraCard.querySelector(".btn-sec");
    adicionarLinha(botaoAdicionarItem);

    const botaoEnviarWhatsapp = document.createElement("button");
    botaoEnviarWhatsapp.className = "btn-main compartilhar";
    botaoEnviarWhatsapp.textContent = "Enviar no WhatsApp";
    botaoEnviarWhatsapp.addEventListener("click", () => compartilharPedidoLista(primeiraCard));
    primeiraCard.appendChild(botaoEnviarWhatsapp);
});
