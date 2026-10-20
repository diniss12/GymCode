package gestaoclientes.dto;

import java.math.BigDecimal;

public record ReceitaPorMetodoResponse(
        String mes,
        BigDecimal totalDinheiro,
        BigDecimal totalMbway,
        BigDecimal totalGeral
) {}