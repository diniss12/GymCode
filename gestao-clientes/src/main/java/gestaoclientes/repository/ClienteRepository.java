package gestaoclientes.repository;

import gestaoclientes.model.Cliente;
import gestaoclientes.model.MotivoExclusao;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;




public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    List<Cliente> findByAtivoTrue();
    List<Cliente> findByAtivoFalseAndMotivoExclusao(MotivoExclusao motivo);
    List<Cliente> findByAtivoFalse();
}

