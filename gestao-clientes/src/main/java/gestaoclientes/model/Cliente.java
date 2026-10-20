package gestaoclientes.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "clientes")
@Data
@NoArgsConstructor
public class Cliente {

    @Column(length = 1000)
    private String notas;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    private LocalDate dataNascimento;

    @Pattern(regexp = "^[0-9]{9,10}$", message = "Telefone deve ter 9 a 10 dígitos numéricos")
    private String telefone;

    @Column(unique = true)
    @Pattern(regexp = "^[0-9]{9}$", message = "NIF deve ter 9 dígitos numéricos")
    private String nif;

    private String localidade;

    @Pattern(regexp = "^[0-9]{4}-[0-9]{3}$", message = "Código postal deve estar no formato 0000-000")
    private String codigoPostal;

    @NotNull(message = "O plano é obrigatório")
    @Enumerated(EnumType.STRING)
    private PlanoSubscricao plano;

    private LocalDate dataInscricao = LocalDate.now();

    private boolean ativo = true;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pagamento> pagamentos = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private MotivoExclusao motivoExclusao;

    private String email;
    private String morada;
    private LocalDate dataExclusao;
}