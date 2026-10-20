package gestaoclientes.dto;

import java.time.LocalDate;

public record ClienteEmAtrasoResponse(Long id, String nome, String telefone, LocalDate ultimoPagamento) {
}