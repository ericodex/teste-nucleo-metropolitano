package com.gestaoprodutos.repository;

import com.gestaoprodutos.model.entity.Usuario;
import java.util.List;

public interface CustomUsuarioRepository {
    List<Usuario> findUsuariosComFiltrosAvancados(String nome, String email, String cpf);
}