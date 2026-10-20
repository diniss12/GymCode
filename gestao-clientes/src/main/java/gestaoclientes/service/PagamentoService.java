package gestaoclientes.service;

import gestaoclientes.dto.CriarPagamentoRequest;
import gestaoclientes.model.Cliente;
import gestaoclientes.model.Pagamento;
import gestaoclientes.repository.PagamentoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class PagamentoService {

    private final PagamentoRepository pagamentoRepository;
    private final ClienteService clienteService;

    public PagamentoService(PagamentoRepository pagamentoRepository, ClienteService clienteService) {
        this.pagamentoRepository = pagamentoRepository;
        this.clienteService = clienteService;
    }

    public List<Pagamento> listarPorCliente(Long clienteId) {
        return pagamentoRepository.findByClienteId(clienteId);
    }

    public Pagamento registar(Long clienteId, CriarPagamentoRequest request) {
        Cliente cliente = clienteService.obterPorId(clienteId);
        Pagamento pagamento = new Pagamento();
        pagamento.setCliente(cliente);
        pagamento.setValor(request.valor());
        pagamento.setDescricao(request.descricao());
        pagamento.setNotas(request.notas());
        pagamento.setMetodoPagamento(request.metodoPagamento());
        pagamento.setPlano(cliente.getPlano());
        pagamento.setDataPagamento(
            request.dataPagamento() != null ? request.dataPagamento() : LocalDate.now()
        );
        return pagamentoRepository.save(pagamento);
    }
}