package com.gestaoprodutos.service;

import com.gestaoprodutos.dto.request.LoginRequest;
import com.gestaoprodutos.dto.request.RegisterRequest;
import com.gestaoprodutos.dto.response.JwtResponse;
import com.gestaoprodutos.exception.BusinessException;
import com.gestaoprodutos.model.entity.Usuario;
import com.gestaoprodutos.model.enums.Role;
import com.gestaoprodutos.repository.UsuarioRepository;
import com.gestaoprodutos.security.JwtTokenProvider;
import com.gestaoprodutos.security.UserPrincipal;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@SuppressWarnings("unused")
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getSenha()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);

        return new JwtResponse(jwt);
    }

    @Transactional
    public Long register(RegisterRequest request) {

        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email já está em uso.");
        }

        if (usuarioRepository.existsByCpf(request.getCpf())) {
            throw new BusinessException("CPF já cadastrado.");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setSenha(passwordEncoder.encode(request.getSenha()));
        usuario.setCpf(request.getCpf());
        usuario.setRole(usuarioRepository.count() == 0 ? Role.ADMIN : Role.USER);

        usuario = usuarioRepository.save(usuario);

        return usuario.getId();
    }

    @Transactional(readOnly = true)
    public List<Usuario> getAllUsers() {
        return usuarioRepository.findAll();
    }
}
