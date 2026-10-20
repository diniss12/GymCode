package gestaoclientes.service;

import gestaoclientes.model.Cliente;
import gestaoclientes.model.MotivoExclusao;
import gestaoclientes.model.PlanoSubscricao;
import gestaoclientes.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }
    public List<Cliente> listarTodos() {
        return clienteRepository.findByAtivoTrue();
    }
    public Cliente obterPorId(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado com id " + id));
    }

    public Cliente criar(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    public Cliente atualizar(Long id, Cliente dadosAtualizados) {
        Cliente cliente = obterPorId(id);
        cliente.setNome(dadosAtualizados.getNome());
        cliente.setDataNascimento(dadosAtualizados.getDataNascimento());
        cliente.setTelefone(dadosAtualizados.getTelefone());
        cliente.setPlano(dadosAtualizados.getPlano());
        cliente.setAtivo(dadosAtualizados.isAtivo());
        cliente.setEmail(dadosAtualizados.getEmail());
        cliente.setMorada(dadosAtualizados.getMorada());
        cliente.setNotas(dadosAtualizados.getNotas());
        cliente.setNif(dadosAtualizados.getNif());
        cliente.setLocalidade(dadosAtualizados.getLocalidade());
        cliente.setCodigoPostal(dadosAtualizados.getCodigoPostal());
        return clienteRepository.save(cliente);
    }

    public Cliente alterarPlano(Long id, PlanoSubscricao novoPlano) {
        Cliente cliente = obterPorId(id);
        cliente.setPlano(novoPlano);
        return clienteRepository.save(cliente);
    }

    // exclusão manual pelo admin
    public void excluir(Long id) {
        Cliente cliente = obterPorId(id);
        cliente.setAtivo(false);
        cliente.setMotivoExclusao(MotivoExclusao.MANUAL);
        cliente.setDataExclusao(LocalDate.now());
        clienteRepository.save(cliente);
    }

    // reativar cliente
    public Cliente reativar(Long id) {
        Cliente cliente = obterPorId(id);
        cliente.setAtivo(true);
        cliente.setMotivoExclusao(null);
        cliente.setDataExclusao(null);
        return clienteRepository.save(cliente);
    }

    // listar excluídos manualmente
    public List<Cliente> listarExcluidosManualmente() {
        return clienteRepository.findByAtivoFalseAndMotivoExclusao(MotivoExclusao.MANUAL);
    }

    // listar excluídos por inatividade
    public List<Cliente> listarExcluidosPorInatividade() {
        return clienteRepository.findByAtivoFalseAndMotivoExclusao(MotivoExclusao.INATIVIDADE);
    }
}