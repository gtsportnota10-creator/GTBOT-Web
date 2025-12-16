// Função para adicionar linha agora aceita o ID da tabela (Camisa ou Short)
function adicionarLinha(tabelaId) {
    const lista = document.getElementById(tabelaId);
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td><input placeholder="Modelo"></td>
        <td><input placeholder="Tam"></td>
        <td><input placeholder="Nº"></td>
        <td><input type="number" min="1" placeholder="1"></td>
        <td><button class="btn-remove" onclick="this.closest('tr').remove()">❌</button></td>
    `;
    lista.appendChild(tr);
}

// Inicia com uma linha em cada
adicionarLinha('listaCamisas');
adicionarLinha('listaShorts');

function extrairDados(tabelaId) {
    const linhas = document.querySelectorAll(`#${tabelaId} tr`);
    let dados = "";
    linhas.forEach(linha => {
        const inputs = linha.querySelectorAll("input");
        const item = inputs[0].value || "";
        const tam = inputs[1].value || "";
        const num = inputs[2].value || "";
        const qtd = inputs[3].value || "";
        if (item || tam || num || qtd) {
            dados += `${item};${tam};${num};${qtd}\n`;
        }
    });
    return dados;
}

function baixarArquivo(nome, conteudo) {
    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = nome;
    a.click();
}

function gerarArquivo() {
    const nomeCli = document.getElementById("clienteNome").value || "CLIENTE";
    const telCli = document.getElementById("clienteTelefone").value || "";
    const cabecalho = `DADOS DO CLIENTE;\nNOME;${nomeCli}\nTELEFONE;${telCli}\n;\n`;

    const dadosCamisas = extrairDados('listaCamisas');
    const dadosShorts = extrairDados('listaShorts');

    if (dadosCamisas) {
        baixarArquivo(`GTBOT_CAMISAS_${nomeCli}.gtb`, cabecalho + "CAMISA;TAMANHO;NÚMERO;QUANTIDADE\n" + dadosCamisas);
    }
    
    if (dadosShorts) {
        // Pequeno atraso para o navegador não bloquear o segundo download
        setTimeout(() => {
            baixarArquivo(`GTBOT_SHORTS_${nomeCli}.gtb`, cabecalho + "SHORT;TAMANHO;NÚMERO;QUANTIDADE\n" + dadosShorts);
        }, 500);
    }

    if (!dadosCamisas && !dadosShorts) alert("Preencha pelo menos um item.");
}

function compartilharPedido() {
    const nomeCli = document.getElementById("clienteNome").value || "";
    const telCli = document.getElementById("clienteTelefone").value || "";
    
    let texto = `*DADOS DO CLIENTE*\nNOME: ${nomeCli}\nTEL: ${telCli}\n\n`;

    const dadosCamisas = extrairDados('listaCamisas');
    if (dadosCamisas) {
        texto += `*👕 CAMISAS*\nMOD;TAM;Nº;QTD\n${dadosCamisas}\n`;
    }

    const dadosShorts = extrairDados('listaShorts');
    if (dadosShorts) {
        texto += `*🩳 SHORTS*\nMOD;TAM;Nº;QTD\n${dadosShorts}\n`;
    }

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
}


/* ================================
   GERAR ARQUIVO GTB
================================ */
function gerarArquivo() {
    let conteudo = "DADOS DO CLIENTE;\n";
    const nomeCliente = document.getElementById("clienteNome").value || "";
    const telefone = document.getElementById("clienteTelefone").value || "";

    conteudo += `NOME;${nomeCliente}\nTELEFONE;${telefone}\n;\n`;
    conteudo += "ITEM;TAMANHO;NÚMERO;QUANTIDADE\n";

    const linhas = document.querySelectorAll("#listaItens tr");
    let temLinha = false;

    linhas.forEach(linha => {
        const inputs = linha.querySelectorAll("input");
        const item = inputs[0].value || "";
        const tamanho = inputs[1].value || "";
        const numero = inputs[2].value || "";
        const quantidade = inputs[3].value || "";

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
   WHATSAPP
================================ */
function compartilharPedido() {
    let texto = "DADOS DO CLIENTE;\n";
    const nomeCliente = document.getElementById("clienteNome").value || "";
    const telefone = document.getElementById("clienteTelefone").value || "";

    texto += `NOME;${nomeCliente}\nTELEFONE;${telefone}\n;\n`;
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

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    
    // Tenta usar a API de compartilhamento do celular, se falhar abre o link direto
    if (navigator.share) {
        navigator.share({ title: "Pedido GTBOT", text: texto })
            .catch(() => window.open(url, '_blank'));
    } else {
        window.open(url, '_blank');
    }
}
