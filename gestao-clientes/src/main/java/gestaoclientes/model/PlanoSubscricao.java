package gestaoclientes.model;

import java.math.BigDecimal;

public enum PlanoSubscricao {
    UMA_VEZ_SEMANA(1, new BigDecimal("21.00")),
    DUAS_VEZES_SEMANA(2, new BigDecimal("23.00")),
    TRES_VEZES_SEMANA(3, new BigDecimal("25.00")),
    QUATRO_VEZES_SEMANA(4, new BigDecimal("27.00")),
    CINCO_VEZES_SEMANA(5, new BigDecimal("29.00")),
    SEIS_VEZES_SEMANA(6, new BigDecimal("30.00")),
    ESPECIAL(0, null);  // preço definido caso a caso

    private final int vezesPorSemana;
    private final BigDecimal precoMensal;

    PlanoSubscricao(int vezesPorSemana, BigDecimal precoMensal) {
        this.vezesPorSemana = vezesPorSemana;
        this.precoMensal = precoMensal;
    }

    public int getVezesPorSemana() {
        return vezesPorSemana;
    }

    public BigDecimal getPrecoMensal() {
        return precoMensal;
    }

    public boolean isEspecial() {
        return this == ESPECIAL;
    }
}