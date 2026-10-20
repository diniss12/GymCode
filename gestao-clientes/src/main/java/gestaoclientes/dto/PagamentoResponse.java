package gestaoclientes.dto;

import gestaoclientes.model.Pagamento;
import gestaoclientes.model.MetodoPagamento;
import gestaoclientes.model.PlanoSubscricao;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PagamentoResponse(Long id, BigDecimal valor, LocalDate dataPagamento, String descricao, MetodoPagamento metodoPagamento, String notas, PlanoSubscricao plano) {
    public static PagamentoResponse from(Pagamento pagamento) {
        return new PagamentoResponse(
                pagamento.getId(),
                pagamento.getValor(),
                pagamento.getDataPagamento(),
                pagamento.getDescricao(),
                pagamento.getMetodoPagamento(),
                pagamento.getNotas(),
                pagamento.getPlano()
        );
    }
}
