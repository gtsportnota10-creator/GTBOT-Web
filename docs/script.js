function adicionarLinha() {
    const lista = document.getElementById("listaItens");

    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td><input placeholder="Nome"></td>
        <td><input placeholder="Tamanho"></td>
        <td><input placeholder="Número"></td>
        <td><input type="number" min="1" placeholder="Qtd"></td>
        <td><button onclick="this.closest('tr').remove()">❌</button></td>
    `;

    lista.appendChild(tr);
}

// cria 1 linha inicial
adicionarLinha();

/* ================================
   GERAR ARQUIVO GTB (PADRÃO MACRO)
================================ */
function gerarArquivo() {
    let conteudo = "";

    // CABEÇALHO CLIENTE
    conteudo += "DADOS DO CLIENTE;\n";

    const nomeCliente = document.getElementById("clienteNome").value || "";
    const telefone = document.getElementById("clienteTelefone").value || "";

    conteudo += `NOME;${nomeCliente}\n`;
    conteudo += `TELEFONE;${telefone}\n`;
    conteudo += ";\n";

    // CABEÇALHO ITENS
    conteudo += "ITEM;TAMANHO;NÚMERO;QUANTIDADE\n";

    const linhas = document.querySelectorAll("#listaItens tr");
    let temLinha = false;

    linhas.forEach(linha => {
        const inputs = linha.querySelectorAll("input");

        const item = inputs[0].value || "";
        const tamanho = inputs[1].value || "";
        const numero = inputs[2].value || "";
        const quantidade = inputs[3].value || "";

        // só ignora linha totalmente vazia
        if (item || tamanho || numero || quantidade) {
            temLinha = true;
            conteudo += `${item};${tamanho};${numero};${quantidade}\n`;
        }
    });

    if (!temLinha) {
        alert("Preencha pelo menos um item.");
        return;
    }

    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "GTBOT_DADOS_PACOTE.gtb";
    a.click();
}

/* ================================
   COMPARTILHAR TEXTO (WHATSAPP)
================================ */
function compartilharPedido() {
    let texto = "DADOS DO CLIENTE;\n";

    const nomeCliente = document.getElementById("clienteNome").value || "";
    const telefone = document.getElementById("clienteTelefone").value || "";

    texto += `NOME;${nomeCliente}\n`;
    texto += `TELEFONE;${telefone}\n`;
    texto += ";\n";
    texto += "ITEM;TAMANHO;NÚMERO;QUANTIDADE\n";

    const linhas = document.querySelectorAll("#listaItens tr");
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
        alert("Preencha pelo menos um item.");
        return;
    }

    if (navigator.share) {
        navigator.share({
            title: "Pedido GTBOT",
            text: texto
        });
    } else {
        alert("Compartilhamento não suportado neste dispositivo.");
    }
}
