package com.gestaoprodutos.service;

import com.gestaoprodutos.dto.UsuarioDTO;
import com.gestaoprodutos.exception.BusinessException;
import com.gestaoprodutos.exception.ResourceNotFoundException;
import com.gestaoprodutos.model.entity.Usuario;
import com.gestaoprodutos.repository.UsuarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public Page<UsuarioDTO> listarTodos(Pageable pageable) {
        return usuarioRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public UsuarioDTO buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", "id", id));
    }

    @Transactional
    public UsuarioDTO criarUsuario(UsuarioDTO usuarioDTO) {
        validarUsuario(usuarioDTO);

        Usuario usuario = convertToEntity(usuarioDTO);
        usuario.setSenha(passwordEncoder.encode(usuarioDTO.getSenha()));

        usuario = usuarioRepository.save(usuario);
        return convertToDTO(usuario);
    }

    @Transactional
    public UsuarioDTO atualizarUsuario(Long id, UsuarioDTO usuarioDTO) {
        return usuarioRepository.findById(id)
                .map(usuarioExistente -> {
                    atualizarDadosUsuario(usuarioExistente, usuarioDTO);
                    Usuario usuarioAtualizado = usuarioRepository.save(usuarioExistente);
                    return convertToDTO(usuarioAtualizado);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", "id", id));
    }

    @Transactional
    public void excluirUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", "id", id));
        usuarioRepository.delete(usuario);
    }

    private void validarUsuario(UsuarioDTO usuarioDTO) {
        if (usuarioRepository.existsByEmail(usuarioDTO.getEmail())) {
            throw new BusinessException("Email já está em uso");
        }

        if (usuarioRepository.existsByCpf(usuarioDTO.getCpf())) {
            throw new BusinessException("CPF já cadastrado");
        }
    }

    private UsuarioDTO convertToDTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setNome(usuario.getNome());
        dto.setEmail(usuario.getEmail());
        dto.setCpf(usuario.getCpf());
        dto.setRole(usuario.getRole());
        
        return dto;
    }

    private Usuario convertToEntity(UsuarioDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setCpf(dto.getCpf());
        usuario.setRole(dto.getRole());

        return usuario;
    }

    private void atualizarDadosUsuario(Usuario usuario, UsuarioDTO dto) {
        if (dto.getNome() != null) {
            usuario.setNome(dto.getNome());
        }

        if (dto.getEmail() != null && !usuario.getEmail().equals(dto.getEmail())) {
            if (usuarioRepository.existsByEmail(dto.getEmail())) {
                throw new BusinessException("Novo email já está em uso");
            }
            usuario.setEmail(dto.getEmail());
        }

        if (dto.getRole() != null) {
            usuario.setRole(dto.getRole());
        }
    }
}