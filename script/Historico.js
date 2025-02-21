export class Historico {
  constructor(atividades) {
    this.atividades = [];
    this.totalHorasExtensao = 0;
    this.totalHorasPesquisa = 0;
    this.totalHorasEnsino = 0;

    if (!atividades) return;

    atividades.forEach(a => {
      this.adicionarAtividade(a);
    })
  }

  calcularTotais() {
    this.totalHorasExtensao = this.getTotalCategoria("extensao");
    this.totalHorasPesquisa = this.getTotalCategoria("pesquisa");
    this.totalHorasEnsino = this.getTotalCategoria("ensino");
  }

  getTotalTipoAtividade(tipoAtividade) {
    const totalHorasNaCategoria = this.atividades
      .filter((a) => a.tipoAtividade.tipo === tipoAtividade.tipo)
      .reduce((sum, a) => sum + a.horasAproveitadas, 0);

    return totalHorasNaCategoria;
  }

  getTotalCategoria(categoria) {
    const totalHorasNaCategoria = this.atividades
      .filter((a) => a.categoria === categoria)
      .reduce((sum, a) => sum + a.horasAproveitadas, 0);

    return totalHorasNaCategoria;
  }

  calcularHorasAproveitadas(horas, tipoAtividade, categoria) {
    let horasAproveitadas = horas * tipoAtividade.aproveitamento;

    if (!tipoAtividade.limitePorAtividade) {
      const totalHorasNoTipoDeAtividade =
        this.getTotalTipoAtividade(tipoAtividade);
      if (totalHorasNoTipoDeAtividade > tipoAtividade.limite) {
        horasAproveitadas = 0;
      } else if (
        totalHorasNoTipoDeAtividade + horasAproveitadas >
        tipoAtividade.limite
      ) {
        horasAproveitadas = tipoAtividade.limite - totalHorasNoTipoDeAtividade;
      }
    }

    const totalHorasCategoria = this.getTotalCategoria(categoria);
    if (totalHorasCategoria > 90) {
      horasAproveitadas = 0;
    } else if (totalHorasCategoria + horasAproveitadas > 90) {
      horasAproveitadas = 90 - totalHorasCategoria;
    }

    return horasAproveitadas;
  }

  recalcularHorasAproveitadas() {
    this.atividades.forEach((atividade) => {
      atividade.horasAproveitadas = 0;
    });

    this.atividades.forEach((atividade) => {
      atividade.horasAproveitadas = this.calcularHorasAproveitadas(
        atividade.horas,
        atividade.tipoAtividade,
        atividade.categoria
      );
    });
  }

  adicionarAtividade(atividade) {
    atividade.horasAproveitadas = this.calcularHorasAproveitadas(
      atividade.horas,
      atividade.tipoAtividade,
      atividade.categoria
    );
    this.atividades.push(atividade);
    this.calcularTotais();
  }

  removerAtividade(id) {
    this.atividades = this.atividades.filter((a) => a.id !== id);
    this.recalcularHorasAproveitadas();
    this.calcularTotais();
  }

  getHistorico() {
    return {
      atividades: this.atividades,
      totalHorasEnsino: this.totalHorasEnsino,
      totalHorasExtensao: this.totalHorasExtensao,
      totalHorasPesquisa: this.totalHorasPesquisa,
    };
  }

  getTotalHorasExtensao() {
    return this.totalHorasExtensao;
  }

  getTotalHorasPesquisa() {
    return this.totalHorasPesquisa;
  }

  getTotalHorasEnsino() {
    return this.totalHorasEnsino;
  }
}
