import Rest from '../Rest'

/**
 * @typedef {AtividadeService}
 */
export default class AtividadeService extends Rest {
    /**
     * @type {String}
     */
    static resource = '/atividades'

    findTotalInscricoesPorAtividade() {
        return this.get("/findTotalInscricoesPorAtividade")
    }

    findTotalParticipacoesPorAtividade() {
        return this.get("/findTotalParticipacoesPorAtividade")
    }

}