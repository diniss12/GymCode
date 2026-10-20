package gestaoclientes.dto;

import gestaoclientes.model.Cliente;
import gestaoclientes.model.PlanoSubscricao;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import gestaoclientes.model.MotivoExclusao;
import java.time.temporal.ChronoUnit;

public record ClienteResponse(
        Long id,
        String nome,
        String nif,
        LocalDate dataNascimento,
        Integer idade,
        String email,
        String morada,
        String localidade,
        String codigoPostal,
        String telefone,
        PlanoSubscricao plano,
        BigDecimal precoMensal,
        LocalDate dataInscricao,
        boolean ativo,
        String notas,
        MotivoExclusao motivoExclusao,
        LocalDate dataExclusao,
        List<PagamentoResponse> pagamentos
) {
    public static ClienteResponse from(Cliente cliente) {
        List<PagamentoResponse> pagamentos = cliente.getPagamentos().stream()
                .map(PagamentoResponse::from)
                .toList();

        Integer idade = cliente.getDataNascimento() != null
                ? (int) ChronoUnit.YEARS.between(cliente.getDataNascimento(), LocalDate.now())
                : null;

        return new ClienteResponse(
                cliente.getId(),
                cliente.getNome(),
                cliente.getNif(),
                cliente.getDataNascimento(),
                idade,
                cliente.getEmail(),
                cliente.getMorada(),
                cliente.getLocalidade(),
                cliente.getCodigoPostal(),
                cliente.getTelefone(),
                cliente.getPlano(),
                cliente.getPlano() != null ? cliente.getPlano().getPrecoMensal() : null,
                cliente.getDataInscricao(),
                cliente.isAtivo(),
                cliente.getNotas(),
                cliente.getMotivoExclusao(),
                cliente.getDataExclusao(),
                pagamentos
        );
    }
}