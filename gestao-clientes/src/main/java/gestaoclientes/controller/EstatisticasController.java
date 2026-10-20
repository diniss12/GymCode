package gestaoclientes.controller;

import gestaoclientes.dto.ClienteEmAtrasoResponse;
import gestaoclientes.dto.EstatisticasGeraisResponse;
import gestaoclientes.dto.ReceitaMensalResponse;
import gestaoclientes.dto.ReceitaPorMetodoResponse;
import gestaoclientes.dto.ReceitaPorPlanoResponse;
import gestaoclientes.dto.RetencaoResponse;
import gestaoclientes.service.EstatisticasService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/estatisticas")
public class EstatisticasController {

    private final EstatisticasService estatisticasService;

    public EstatisticasController(EstatisticasService estatisticasService) {
        this.estatisticasService = estatisticasService;
    }

    @GetMapping("/pagamentos-em-atraso")
    public List<ClienteEmAtrasoResponse> pagamentosEmAtraso(
            @RequestParam(defaultValue = "8") int diaLimite) {
        return estatisticasService.clientesEmAtraso(diaLimite);
    }

    @GetMapping("/gerais")
    public EstatisticasGeraisResponse gerais() {
        return estatisticasService.estatisticasGerais();
    }

    @GetMapping("/receita-mensal")
    public List<ReceitaMensalResponse> receitaMensal(
            @RequestParam(defaultValue = "6") int meses) {
        return estatisticasService.receitaPorMes(meses);
    }

    @GetMapping("/receita-por-metodo")
    public ReceitaPorMetodoResponse receitaPorMetodo(
            @RequestParam(defaultValue = "0") int ano,
            @RequestParam(defaultValue = "0") int mes) {

        // se não vier ano/mês, usa o mês atual
        LocalDate hoje = LocalDate.now();
        int anoFinal = ano == 0 ? hoje.getYear() : ano;
        int mesFinal = mes == 0 ? hoje.getMonthValue() : mes;

        return estatisticasService.receitaPorMetodo(anoFinal, mesFinal);
    }

    @GetMapping("/receita-por-plano")
    public List<ReceitaPorPlanoResponse> receitaPorPlano(
            @RequestParam(defaultValue = "6") int meses) {
        return estatisticasService.receitaPorPlano(meses);
    }

    @GetMapping("/retencao")
    public List<RetencaoResponse> retencao(
            @RequestParam(defaultValue = "6") int meses) {
        return estatisticasService.retencaoMensalUltimosMeses(meses);
    }
}