package gestaoclientes.service;

import gestaoclientes.dto.ClienteEmAtrasoResponse;
import gestaoclientes.dto.EstatisticasGeraisResponse;
import gestaoclientes.dto.ReceitaMensalResponse;
import gestaoclientes.dto.ReceitaPorMetodoResponse;
import gestaoclientes.dto.ReceitaPorPlanoResponse;
import gestaoclientes.dto.RetencaoResponse;
import gestaoclientes.model.Cliente;
import gestaoclientes.model.MetodoPagamento;
import gestaoclientes.model.MotivoExclusao;
import gestaoclientes.model.PlanoSubscricao;
import gestaoclientes.repository.ClienteRepository;
import gestaoclientes.repository.PagamentoRepository;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class EstatisticasService {

    private final ClienteRepository clienteRepository;
    private final PagamentoRepository pagamentoRepository;

    public EstatisticasService(ClienteRepository clienteRepository, PagamentoRepository pagamentoRepository) {
        this.clienteRepository = clienteRepository;
        this.pagamentoRepository = pagamentoRepository;
    }

    // clientes em atraso (já existia)
    public List<ClienteEmAtrasoResponse> clientesEmAtraso(int diaLimite) {
        LocalDate hoje = LocalDate.now();
        if (hoje.getDayOfMonth() < diaLimite) {
            return List.of();
        }
        LocalDate inicioMes = hoje.withDayOfMonth(1);
        return clienteRepository.findByAtivoTrue().stream()
                .filter(c -> !pagamentoRepository
                        .existsByClienteIdAndDataPagamentoBetween(c.getId(), inicioMes, hoje))
                .map(this::paraResposta)
                .toList();
    }

    private ClienteEmAtrasoResponse paraResposta(Cliente cliente) {
        LocalDate ultimoPagamento = pagamentoRepository
                .findTopByClienteIdOrderByDataPagamentoDesc(cliente.getId())
                .map(p -> p.getDataPagamento())
                .orElse(null);
        return new ClienteEmAtrasoResponse(cliente.getId(), cliente.getNome(), cliente.getTelefone(), ultimoPagamento);
    }

    // estatísticas gerais do ginásio
    public EstatisticasGeraisResponse estatisticasGerais() {
        List<Cliente> todos = clienteRepository.findAll();
        long ativos = todos.stream().filter(Cliente::isAtivo).count();
        long inativos = todos.size() - ativos;

        // receita esperada este mês = soma dos planos de todos os clientes ativos
        BigDecimal receitaEsperada = todos.stream()
                .filter(Cliente::isAtivo)
                .filter(c -> !c.getPlano().isEspecial())
                .map(c -> c.getPlano().getPrecoMensal())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // receita real este mês = soma dos pagamentos registados este mês
        LocalDate hoje = LocalDate.now();
        LocalDate inicioMes = hoje.withDayOfMonth(1);
        BigDecimal receitaReal = pagamentoRepository
                .sumValorBetween(inicioMes, hoje)
                .orElse(BigDecimal.ZERO);

        // distribuição por plano
        Map<PlanoSubscricao, Long> distribuicaoPlanos = todos.stream()
                .filter(Cliente::isAtivo)
                .collect(Collectors.groupingBy(Cliente::getPlano, Collectors.counting()));

        return new EstatisticasGeraisResponse(
                todos.size(), ativos, inativos,
                receitaEsperada, receitaReal,
                distribuicaoPlanos
        );
    }

    // receita mês a mês (últimos N meses)
    public List<ReceitaMensalResponse> receitaPorMes(int ultimosMeses) {
        LocalDate hoje = LocalDate.now();

        // LinkedHashMap para preservar a ordem cronológica
        LinkedHashMap<YearMonth, BigDecimal> meses = new LinkedHashMap<>();
        for (int i = ultimosMeses - 1; i >= 0; i--) {
            meses.put(YearMonth.from(hoje).minusMonths(i), BigDecimal.ZERO);
        }

        pagamentoRepository.findAll().forEach(p -> {
            YearMonth mes = YearMonth.from(p.getDataPagamento());
            if (meses.containsKey(mes)) {
                meses.merge(mes, p.getValor(), BigDecimal::add);
            }
        });

        return meses.entrySet().stream()
                .map(e -> new ReceitaMensalResponse(e.getKey().toString(), e.getValue()))
                .toList();
    }

    public ReceitaPorMetodoResponse receitaPorMetodo(int ano, int mes) {
        LocalDate inicio = LocalDate.of(ano, mes, 1);
        LocalDate fim = YearMonth.of(ano, mes).atEndOfMonth();

        BigDecimal dinheiro = pagamentoRepository
                .sumValorByMetodoAndBetween(MetodoPagamento.DINHEIRO, inicio, fim)
                .orElse(BigDecimal.ZERO);

        BigDecimal mbway = pagamentoRepository
                .sumValorByMetodoAndBetween(MetodoPagamento.MBWAY, inicio, fim)
                .orElse(BigDecimal.ZERO);

        String mesFormatado = YearMonth.of(ano, mes).toString();
        return new ReceitaPorMetodoResponse(mesFormatado, dinheiro, mbway, dinheiro.add(mbway));
    }

    public List<ReceitaPorPlanoResponse> receitaPorPlano(int ultimosMeses) {
        LocalDate hoje = LocalDate.now();
        LocalDate inicio = hoje.minusMonths(ultimosMeses).withDayOfMonth(1);

        return pagamentoRepository.sumValorByPlanoAndBetween(inicio, hoje)
                .stream()
                .map(row -> new ReceitaPorPlanoResponse(
                        (PlanoSubscricao) row[0],
                        (BigDecimal) row[1]
                ))
                .toList();
    }

    public List<RetencaoResponse> retencaoMensalUltimosMeses(int ultimosMeses) {
        LocalDate hoje = LocalDate.now();
        List<RetencaoResponse> resultado = new ArrayList<>();

        for (int i = ultimosMeses - 1; i >= 1; i--) {
            YearMonth mesAnterior = YearMonth.from(hoje).minusMonths(i);
            YearMonth mesAtual    = YearMonth.from(hoje).minusMonths(i - 1);

            LocalDate inicioAnterior = mesAnterior.atDay(1);
            LocalDate fimAnterior    = mesAnterior.atEndOfMonth();
            LocalDate inicioAtual    = mesAtual.atDay(1);
            LocalDate fimAtual       = mesAtual.atEndOfMonth();

            // clientes que pagaram no mês anterior
            List<Long> idsAnterior = pagamentoRepository
                    .findClienteIdsComPagamentoBetween(inicioAnterior, fimAnterior);

            if (idsAnterior.isEmpty()) continue;

            // desses, quantos também pagaram no mês atual
            List<Long> idsAtual = pagamentoRepository
                    .findClienteIdsComPagamentoBetween(inicioAtual, fimAtual);

            long retidos = idsAnterior.stream().filter(idsAtual::contains).count();

            BigDecimal taxa = BigDecimal.valueOf(retidos)
                    .divide(BigDecimal.valueOf(idsAnterior.size()), 4, java.math.RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(2, java.math.RoundingMode.HALF_UP);

            resultado.add(new RetencaoResponse(
                    mesAtual.toString(),
                    idsAnterior.size(),
                    (int) retidos,
                    taxa
            ));
        }

        return resultado;
    }

    @Scheduled(cron = "0 0 3 * * *") // corre todos os dias às 3 da manhã
    public void excluirClientesPorInatividade() {
        LocalDate limite = LocalDate.now().minusMonths(3);

        clienteRepository.findByAtivoTrue().forEach(cliente -> {
            boolean temPagamentoRecente = pagamentoRepository
                    .findTopByClienteIdOrderByDataPagamentoDesc(cliente.getId())
                    .map(p -> p.getDataPagamento().isAfter(limite))
                    .orElse(false);

            if (!temPagamentoRecente) {
                cliente.setAtivo(false);
                cliente.setMotivoExclusao(MotivoExclusao.INATIVIDADE);
                cliente.setDataExclusao(LocalDate.now());
                clienteRepository.save(cliente);
            }
        });
    }
}