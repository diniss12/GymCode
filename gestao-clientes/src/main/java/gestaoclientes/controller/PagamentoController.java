package gestaoclientes.controller;

import gestaoclientes.dto.CriarPagamentoRequest;
import gestaoclientes.dto.PagamentoResponse;
import gestaoclientes.model.Pagamento;
import gestaoclientes.service.PagamentoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes/{clienteId}/pagamentos")
public class PagamentoController {

    private final PagamentoService pagamentoService;

    public PagamentoController(PagamentoService pagamentoService) {
        this.pagamentoService = pagamentoService;
    }

    @GetMapping
    public List<PagamentoResponse> listar(@PathVariable Long clienteId) {
        return pagamentoService.listarPorCliente(clienteId).stream()
                .map(PagamentoResponse::from)
                .toList();
    }

    @PostMapping
    public ResponseEntity<PagamentoResponse> registar(@PathVariable Long clienteId,
                                                        @RequestBody CriarPagamentoRequest request) {
        Pagamento pagamento = pagamentoService.registar(clienteId, request);
        return ResponseEntity.status(201).body(PagamentoResponse.from(pagamento));
    }
}