let contadorListas = 1;

/* ===============================
   EVENTOS GLOBAIS
================================ */
document.addEventListener("click", function (e) {

    // Adicionar item
    if (e.target.classList.contains("btn-add-item")) {
        e.preventDefault();
        adicionarLinha(e.target);
    }

    // Enviar WhatsApp
    if (e.target.classList.contains("btn-enviar")) {
        e.preventDefault();
        const card = e.target.closest(".lista-pedido");
        compartilharPedidoLista(card);
    }

    // Fechar lista
    if (e.target.classList.contains("btn-fechar-lista")) {
        e.preventDefault();
        const card = e.target.closest(".lista-pedido");
        if (confirm("Deseja realmente fechar esta lista?")) {
            card.remove();
        }
    }
});

// Botões fixos
document.getElementById("btnNovaLista").addEventListener("click", adicionarNovaLista);
document.getElementById("btnBaixar").addEventListener("click", gerarArquivo);

/* ===============================
   FUNÇÕES
================================ */

function adicionarLinha(botao) {
    const card = botao.closest(".lista-pedido");
    const lista = card.querySelector(".lista-itens");

    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td><input placeholder="Ex: João"></td>
        <td><input placeholder="G"></td>
        <td><input placeholder="10"></td>
        <td><input type="number" min="1" placeholder="1"></td>
        <td><button type="button" class="btn-remove" onclick="this.closest('tr').remove()">❌</button></td>
    `;

    lista.appendChild(tr);
    setTimeout(() => tr.querySelector("input").focus(), 50);
}

function adicionarNovaLista() {
    contadorListas++;

    const container = document.getElementById("listasContainer");

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
                        <th class="col-qtd">Qtd</th>
                        <th class="col-del"></th>
                    </tr>
                </thead>
                <tbody class="lista-itens"></tbody>
            </table>
        </div>

        <button type="button" class="btn-sec btn-add-item">➕ Adicionar Item</button>
        <button type="button" class="btn-main compartilhar btn-enviar">Enviar no WhatsApp</button>
        <button type="button" class="btn-remove btn-fechar-lista" style="margin-top:10px;">Fechar Lista</button>
    `;

    container.appendChild(card);
}

function gerarArquivo() {
    let conteudo = "DADOS DO CLIENTE;\n";
    conteudo += `NOME;${clienteNome.value}\nTELEFONE;${clienteTelefone.value}\n;\n`;

    document.querySelectorAll(".lista-pedido").forEach(card => {
        const modelagem = card.querySelector(".modelagem-valor").value || "";
        conteudo += `MODELAGEM;${modelagem}\n`;
        conteudo += "ITEM;TAMANHO;NÚMERO;QUANTIDADE\n";

        card.querySelectorAll(".lista-itens tr").forEach(tr => {
            const i = tr.querySelectorAll("input");
            if (i[0].value || i[1].value || i[2].value || i[3].value) {
                conteudo += `${i[0].value};${i[1].value};${i[2].value};${i[3].value}\n`;
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

function compartilharPedidoLista(card) {
    let texto = "DADOS DO CLIENTE;\n";
    texto += `NOME;${clienteNome.value}\nTELEFONE;${clienteTelefone.value}\n;\n`;

    texto += `MODELAGEM;${card.querySelector(".modelagem-valor").value}\n`;
    texto += "ITEM;TAMANHO;NÚMERO;QUANTIDADE\n";

    let temItem = false;

    card.querySelectorAll(".lista-itens tr").forEach(tr => {
        const i = tr.querySelectorAll("input");
        if (i[0].value || i[1].value || i[2].value || i[3].value) {
            temItem = true;
            texto += `${i[0].value};${i[1].value};${i[2].value};${i[3].value}\n`;
        }
    });

    if (!temItem) {
        alert("Preencha pelo menos um item.");
        return;
    }

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, "_blank");
}

/* Linha inicial automática */
document.addEventListener("DOMContentLoaded", () => {
    adicionarLinha(document.querySelector(".btn-add-item"));
});

