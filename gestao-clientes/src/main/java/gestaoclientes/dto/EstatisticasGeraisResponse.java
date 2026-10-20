package gestaoclientes.dto;

import gestaoclientes.model.PlanoSubscricao;

import java.math.BigDecimal;
import java.util.Map;

public record EstatisticasGeraisResponse(
        int totalClientes,
        long clientesAtivos,
        long clientesInativos,
        BigDecimal receitaEsperadaMes,
        BigDecimal receitaRealMes,
        Map<PlanoSubscricao, Long> distribuicaoPorPlano
) {}