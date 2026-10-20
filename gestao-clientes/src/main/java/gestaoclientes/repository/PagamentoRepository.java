package gestaoclientes.repository;

import gestaoclientes.model.MetodoPagamento;
import gestaoclientes.model.Pagamento;
import gestaoclientes.model.PlanoSubscricao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;




public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {
    List<Pagamento> findByClienteId(Long clienteId);

    boolean existsByClienteIdAndDataPagamentoBetween(Long clienteId, LocalDate inicio, LocalDate fim);

    Optional<Pagamento> findTopByClienteIdOrderByDataPagamentoDesc(Long clienteId);



    @Query("SELECT SUM(p.valor) FROM Pagamento p WHERE p.dataPagamento BETWEEN :inicio AND :fim")
    Optional<BigDecimal> sumValorBetween(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);

    @Query("SELECT SUM(p.valor) FROM Pagamento p WHERE p.dataPagamento BETWEEN :inicio AND :fim AND p.metodoPagamento = :metodo")
    Optional<BigDecimal> sumValorByMetodoAndBetween(
            @Param("metodo") MetodoPagamento metodo,
            @Param("inicio") LocalDate inicio,
            @Param("fim") LocalDate fim
    );

    @Query("""
        SELECT p.plano, SUM(p.valor)
        FROM Pagamento p
        WHERE p.dataPagamento BETWEEN :inicio AND :fim
        AND p.plano IS NOT NULL
        GROUP BY p.plano
        """)
    List<Object[]> sumValorByPlanoAndBetween(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);

    @Query("""
        SELECT DISTINCT p.cliente.id
        FROM Pagamento p
        WHERE p.dataPagamento BETWEEN :inicio AND :fim
        """)
    List<Long> findClienteIdsComPagamentoBetween(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);
}