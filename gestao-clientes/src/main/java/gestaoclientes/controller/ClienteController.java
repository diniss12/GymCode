package gestaoclientes.controller;

import gestaoclientes.model.Cliente;
import gestaoclientes.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import gestaoclientes.dto.AlterarPlanoRequest;
import gestaoclientes.dto.ClienteResponse;


import java.util.List;



@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        clienteService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public List<ClienteResponse> listar() {
        return clienteService.listarTodos().stream()
                .map(ClienteResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public ClienteResponse obter(@PathVariable Long id) {
        return ClienteResponse.from(clienteService.obterPorId(id));
    }

    @PostMapping
    public ResponseEntity<ClienteResponse> criar(@Valid @RequestBody Cliente cliente) {
        Cliente novoCliente = clienteService.criar(cliente);
        return ResponseEntity.status(201).body(ClienteResponse.from(novoCliente));
    }

    @PutMapping("/{id}")
    public ClienteResponse atualizar(@PathVariable Long id, @RequestBody Cliente cliente) {
        return ClienteResponse.from(clienteService.atualizar(id, cliente));
    }

    @PatchMapping("/{id}/plano")
    public ClienteResponse alterarPlano(@PathVariable Long id, @RequestBody AlterarPlanoRequest request) {
        return ClienteResponse.from(clienteService.alterarPlano(id, request.plano()));
    }


    @GetMapping("/excluidos/manual")
    public List<ClienteResponse> excluidosManualmente() {
        return clienteService.listarExcluidosManualmente().stream()
                .map(ClienteResponse::from)
                .toList();
    }

    @GetMapping("/excluidos/inatividade")
    public List<ClienteResponse> excluidosPorInatividade() {
        return clienteService.listarExcluidosPorInatividade().stream()
                .map(ClienteResponse::from)
                .toList();
    }

    @PatchMapping("/{id}/reativar")
    public ClienteResponse reativar(@PathVariable Long id) {
        return ClienteResponse.from(clienteService.reativar(id));
    }
}