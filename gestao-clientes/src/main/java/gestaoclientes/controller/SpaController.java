package gestaoclientes.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    @RequestMapping(value = {
        "/", "/clientes", "/clientes/**",
        "/backoffice", "/excluidos"
    })
    public String spa() {
        return "forward:/index.html";
    }
}