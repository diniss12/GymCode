package gestaoclientes.dto;

import gestaoclientes.model.MetodoPagamento;
import java.math.BigDecimal;
import java.time.LocalDate;

public record CriarPagamentoRequest(
        BigDecimal valor,
        String descricao,
        MetodoPagamento metodoPagamento,
        LocalDate dataPagamento,
        String notas
) {}