package gestaoclientes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GestaoClientesApplication {
    public static void main(String[] args) {
        SpringApplication.run(GestaoClientesApplication.class, args);
    }
}