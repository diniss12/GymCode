package gestaoclientes.dto;

import java.math.BigDecimal;

public record RetencaoResponse(
        String mes,
        int clientesAtivosAnterior,
        int clientesQuePagaram,
        BigDecimal taxaRetencao  // percentagem, ex: 85.00
) {}
