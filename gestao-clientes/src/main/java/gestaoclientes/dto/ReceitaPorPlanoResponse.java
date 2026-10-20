package gestaoclientes.dto;

import gestaoclientes.model.PlanoSubscricao;
import java.math.BigDecimal;

public record ReceitaPorPlanoResponse(PlanoSubscricao plano, BigDecimal total) {}
